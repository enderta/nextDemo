import jwt from "jsonwebtoken";
import {connectDb} from '../../db';

const secret = 'your_secret_key_here';

export default async function handler(req, res) {
    const id = req.query.id;
    const token = req.headers.authorization;
    const {client} = await connectDb();
    const {method} = req
    const decoded = jwt.verify(token, secret);
    if (method === "GET") {
        try {
            if (!token) {
                return res.status(401).json({message: 'Unauthorized'});
            }

            const {rows} = await client.query(
                'SELECT * FROM blog_posts WHERE id = $1',
                [id]
            );

            if (!rows || rows.length === 0) {
                return res.status(404).json({message: 'Post not found'});
            }

            return res.status(200).json({
                status: 'success',
                message: 'Blog post found',
                data: {
                    rows,
                },
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({message: 'Internal server error'});
        } finally {
            client.release();
        }
    }
    if (method === "PUT") {
        try {
            if (!token) {
                return res.status(401).json({message: 'Unauthorized'});
            }
            if (decoded.user.role !== "admin") {
                return res.status(403).json({message: "Forbidden"});
            }

            const {title, content, author, image_url,updated_at} = req.body;
            const {rows} = await client.query(
                "UPDATE blog_posts SET title = $1, content = $2, author = $3, image_url = $4, updated_at = $5 WHERE id = $6 RETURNING *",
                [title, content, author, image_url,updated_at, id]
            );
            if (rows.length === 0) {
                return res.status(404).json({
                    status: "error",
                    message: "Blog post not found",
                });
            }
            res.status(200).json({
                status: "success",
                message: "Blog post updated",
                data: {
                    rows
                }
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        } finally {
            client.release();
        }

    }
    if (method === "DELETE") {
        try {
            if (!token) {
                return res.status(401).json({message: 'Unauthorized'});
            }
            if (decoded.user.role !== "admin") {
                return res.status(403).json({message: "Forbidden"});
            }
            const {rows} = await client.query(
                "DELETE FROM blog_posts WHERE id = $1 RETURNING *",
                [id]
            );
            if (rows.length === 0) {
                return res.status(404).json({
                    status: "error",
                    message: "Blog post not found",
                });
            }
            res.status(200).json({
                status: "success",
                message: "Blog post deleted",
                data: rows[0],
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        } finally {
            client.release();
        }
    }
}


