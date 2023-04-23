import {connectDb, releaseDb} from '../db';
import jwt from 'jsonwebtoken';
import {check, validationResult} from 'express-validator';
import * as path from "path";

const secret = 'your_secret_key_here';

export default async function allPosts(req, res) {
    const {method} = req;
    const search = req.query.search || "";
    const {client} = await connectDb();
    if (method === 'GET') {
        try {
            if (search) {
                const {rows} = await client.query(
                    //search by title, content, author
                    "SELECT * FROM blog_posts WHERE title ILIKE $1 OR content ILIKE $2 OR author ILIKE $3 ORDER BY created_at DESC",
                    [`%${search}%`, `%${search}%`, `%${search}%`]
                );
                res.status(200).json({
                    status: "success",
                    message: `${rows.length} blog posts found for search term: ${search}`,
                    data: {
                        rows
                    }
                });

            } else {
                const {rows} = await client.query(
                    "SELECT * FROM blog_posts ORDER BY created_at DESC"
                );
                res.status(200).json({
                    status: "success",
                    message: `${rows.length} blog posts found`,
                    data: {
                        rows
                    }
                });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({
                status: "error",
                message: "Error fetching blog posts"
            });
        }
      client.release();
    }
    if (method === 'POST') {
        try {
            await check("title", "Please enter a title").not().isEmpty().run(req);
            await check("content", "Please enter some content").not().isEmpty().run(req);
            await check("author", "Please enter an author").not().isEmpty().run(req);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }
            const {title, content, author, image_url} = req.body;
            //only allow logged in users to create posts
            const token = req.headers.authorization;
            if (!token) {
                return res.status(401).json({message: "Unauthorized"});
            }
            const decoded = jwt.verify(token, secret);
            if (decoded.user.role !== "admin") {
                return res.status(403).json({message: "Forbidden"});
            }
            const {rows} = await client.query(
                "INSERT INTO blog_posts (title, content, author, image_url) VALUES ($1, $2, $3, $4) RETURNING *",
                [title, content, author, image_url]
            );
            res.status(201).json({
                    status: "success",
                    message: "Blog post created",
                    data: {
                        id: rows[0].id,
                        title: rows[0].title,
                        content: rows[0].content,
                        image_url: rows[0].image_url,
                        created_at: rows[0].created_at,
                    }
                }
            );
        } catch (err) {
            console.error(err);
            res.status(500).json({
                status: "error",
                message: "Error creating blog post"
            });


        }
        client.release();


    }



}

