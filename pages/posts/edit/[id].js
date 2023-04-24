import React, {useEffect, useState} from "react";
import { useRouter } from 'next/router'
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faPaperPlane, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../../components/Navbar";

export default function edit() {
    const [post, setPost] = useState([]);
    const [author, setAuthor] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image_url, setImage_url] = useState("");
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const id= router.query.id;
    const created_at = new Date().toISOString();


    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
            fetch(`http://localhost:3000/api/post/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                }
            })
                .then(res => res.json())
                .then(data => {
                        setPost(data.data.rows[0]);
                        setAuthor(data.data.rows[0].author);
                        setTitle(data.data.rows[0].title);
                        setContent(data.data.rows[0].content);
                        setImage_url(data.data.rows[0].image_url);
                        setLoading(false);
                }
                )
                .catch((err) => console.log(err));
        }
        , [id])
    console.log(post)
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        fetch(`http://localhost:3000/api/post/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token"),
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
            },
            body: JSON.stringify({
                title: title,
                content: content,
                author: author,
                image_url: image_url,
                created_at: created_at
            })
        })
            .then(res => res.json())
            .then(data => {
                    setLoading(false);

                }
            )
            .catch((err) => console.log(err));
        setTitle("");
        setContent("");
        setAuthor("");
        setImage_url("");
        router.push("/home");
    }
        const handleTitle = (e) => {
            e.preventDefault();
            setTitle(e.target.value);
        }


        const handleContent = (e) => {
            e.preventDefault();
            setContent(e.target.value);
        }
        const handleAuthor = (e) => {
            e.preventDefault();
            setAuthor(e.target.value);
        }
        const handleImage_url = (e) => {
            e.preventDefault();
            setImage_url(e.target.value);
        }

        const handleDate = (e) => {
            e.preventDefault();
            setDate(new Date(e.target.value)) ;
        }


        return (
        <>
            <div>
                <Navbar/>
                <div>
                    {localStorage.getItem("role")!=="admin" ? window.location.href = "/home" :

                        loading  ? <h5 style={{color: "goldenrod", textAlign: "center"}}>loading...</h5> :(

                            <div className="container">
                                <div>
                                    <h1 style={{color: "goldenrod", textAlign: "center"}}>Edit post</h1>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">

                                        <form onSubmit={handleSubmit}>
                                            <div className="form-group">
                                                <label htmlFor="title">Title</label>
                                                <input type="text" className="form-control" id="title" value={title}  onChange={handleTitle}/>
                                                <div className="form-group">
                                                    <label htmlFor="content">Content</label>
                                                    <textarea className="form-control" id="content" value={content} rows="3"
                                                              onChange={handleContent}></textarea>
                                                    <div className="form-group">
                                                        <label htmlFor="author">Author</label>
                                                        <input type="text" className="form-control" value={author} id="author"
                                                               onChange={handleAuthor}/>
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="image_url">Image url</label>
                                                        <input type="text" className="form-control" value={image_url} id="image_url"
                                                               onChange={handleImage_url}/>
                                                    </div>

                                                </div>
                                            </div>
                                            <br/>
                                            <Button type="submit" variant={"outline-warning"}>
                                                <FontAwesomeIcon  icon={faPaperPlane}/>
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    </div>
                </div>
            </>
        );
    }


