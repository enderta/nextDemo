import React  from "react";
import { useRouter } from 'next/router'
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/Navbar";
import Link from "next/link";

export default function Post() {
    const [post, setPost] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const router = useRouter();
    const id= router.query.id;
    React.useEffect(() => {
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
                    setLoading(false);
                })
                .catch((err) => console.log(err));
        }
        , [id])



    return (
        <>
            <div>
                <Navbar/>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h1 style={{color: "goldenrod", textAlign: "center"}}>{post.title}</h1>
                            {loading ? <h5 style={{color: "goldenrod", textAlign: "center"}}>loading...</h5> : (
                                <div>
                                    {
                                        (localStorage.getItem("role") === "admin") ? (
                                            <div className="d-flex justify-content-end">
                                                <Button variant={"outline-danger"}  >
                                                    <Link href={`/posts/delete/${id}`} >

                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                    </Link>

                                                </Button>
                                                <Button variant={"outline-info"}  >
                                                <Link href={`/posts/edit/${id}`}  >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </Link>
                                                </Button>
                                            </div>
                                        ) : (
                                            <div></div>
                                        )
                                    }
                                </div>
                            )}
                            <br/>
                            <div>
                                <div >
                                    <div >
                                        <div style={{ whiteSpace: "pre-wrap" , wordWrap: "break-word", wordBreak: "break-word" }}>
                                            {post.content}
                                        </div>
                                        <br/>
                                        <div>
                                            <h6 className="card-subtitle mb-2 text-muted">{post.author}</h6>
                                        </div>
                                        <br/>
                                    </div>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img className={"card-img-top"} src={post.image_url} style={{height:"400px",width:"600px"}} alt="Card image cap"/>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
