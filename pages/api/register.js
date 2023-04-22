import { connectDb } from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';

const secret = 'your_secret_key_here';

export default async function register(req, res) {
    const { method, body: { username, password, email, role } } = req;
    const pool = await connectDb();
    if (method === 'POST') {
        try {
            // Validation checks

            await check('username', 'Please enter a username').not().isEmpty().run(req);
            await check('email', 'Please include a valid email').isEmail().run(req);
            await check('password', 'Please enter a password with 6 or more characters').isLength({min: 6}).run(req);
            await check('role', 'Please enter a role').not().isEmpty().run(req);

            let errors = validationResult(req);


            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Fill in all fields' });
            }

            // Check if user already exists
            const { client } = await connectDb();

            const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
            if (result.rows.length > 0) {
                return res.status(400).json({ message: 'User already exists' });
            }



            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create the user
            const query = "INSERT INTO users (email, password, username, role) VALUES ($1, $2, $3, $4) RETURNING *";
            const values = [email, hashedPassword, username, role];
            await client.query(query, values);
            client.release();
            res.status(201).json({
                message: 'User created',
                data: {
                    email,
                    password,
                    username,
                    role,
                },
            });
        } catch (err) {
            console.error(err);
        }

    } else if (method !== 'POST') {
        res.status(405).json({ message: 'Method not allowed' });
    }
    //constrains error
    else {
        res.status(400).json({ message: 'Bad request' });
    }
}
