import Head from 'next/head';
import Layout, {siteTitle} from '../components/Layout';
import utilStyles from '../styles/utils.module.css';
import Link from "next/link";
import React  from "react";
import {useEffect, useState} from "react";
import {faBookOpenReader, faSearch} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Navbar from "../components/Navbar";
import Single from "../components/Single";

export default function Home() {
    const [posts, setPosts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [search, setSearch] = React.useState("");

    useEffect(() => {
        fetch(`http://localhost:3000/api/allPosts?search=${search}`, {
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
                    setPosts(data.data.rows);
                    setLoading(false);
                }
            )
            .catch((err) => console.log(err));
    }, [search]);
    console.log(posts)
    return (
        <>
            <div>
                <Navbar search={setSearch}/>
                <div>
                    <FontAwesomeIcon icon={faSearch} color={'goldenRod'} style={{margin: "5px"}}/>
                    <input
                        type="text"
                        placeholder="Search"
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}
                    />
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h1 style={{color: "goldenrod", textAlign: "center"}}>Posts</h1>
                            {loading ? <h5 style={{color: "goldenrod", textAlign: "center"}}>loading...</h5> : (
                                <div className="row">
                                    {posts.map((post) => (
                                        // eslint-disable-next-line react/jsx-key
                                        <div className="col-md-4">
                                            <div className="card" style={{height: "30rem", width: "18rem", margin: "5px"}}>
                                                <img className={"card-img-top"} src={post.image_url} alt="Card image cap"/>
                                                <div className="card-body">
                                                    <h6 className="card-title mb-2 text-muted">Title: {post.title}</h6>
                                                    <h6 className="card-subtitle mb-2 text-muted">Author: {post.author}</h6>
                                                    <p>
                                                        {post.content.length > 100 ? post.content.substring(0, 100) + "..." : post.content}
                                                    </p>
                                                </div>
                                                <span style={{margin: "5px"}}>
                                                <Link href={`posts/${post.id}`}>
                                                     <FontAwesomeIcon icon={faBookOpenReader}/>
                                                </Link>
                                            </span>
                                                <br/>
                                                <h6 className="card-subtitle mb-2 text-muted">
                                                    Posted: {new Date(post.created_at).toLocaleDateString()}
                                                </h6>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}