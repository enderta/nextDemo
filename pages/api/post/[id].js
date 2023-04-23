import path from "path";
import jwt from "jsonwebtoken";
import {check, validationResult} from "express-validator";
import {connectDb, releaseDb} from '../../db';
import { useRouter } from 'next/router';


    export default async function handler(req, res) {
        const {method} = req;
        const {client} = await connectDb();
        const id = req.query.id;


        if (method === 'GET') {
            try {
                const {rows} = await client.query(
                    "SELECT * FROM blog_posts WHERE id = $1",
                    [id]
                );
                res.status(200).json({
                    status: "success",
                    message: `blog post found`,
                    data: {
                        rows
                    }
                });
            } catch (err) {
                console.error(err);
                res.status(500).json({
                    status: "error",
                    message: "Error fetching blog posts"
                });
            } finally {
                client.release();
            }
        }
    }