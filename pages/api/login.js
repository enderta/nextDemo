import {connectDb, releaseDb} from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';

const secret = 'your_secret_key_here';

export default async function login(req, res) {
    const { method, body: { email, password } } = req;

    if (method === 'POST') {
        try {
            // Validation checks
            await check('email', 'Please include a valid email').isEmail().run(req);
            await check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }).run(req);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Check if user already exists
            const { client } = await connectDb();


            const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
            if (result.rows.length === 0) {

                return res.status(400).json({ message: 'User does not exist' });
            }
            const user = result.rows[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                client.release();
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Create and send the JWT
            const payload = {
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                }
            }
            jwt.sign(payload, secret, { expiresIn: '1h' }, (err, token) => {
                client.release();
                if (err) throw err;
                res.status(201).json({
                    message: 'User logged in',
                    data: {
                        token,
                        role: result.rows[0].role,
                        id: result.rows[0].id,
                        email: result.rows[0].email,
                        username: result.rows[0].username,
                    },
                });
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ errors: [{ msg: 'Server error' }] });
        }

    } else if (method !== 'POST') {
        res.status(405).json({ message: 'Method not allowed' });
    } else {
        //bad request
        res.status(400).json({ message: 'Bad request' });
    }

}
