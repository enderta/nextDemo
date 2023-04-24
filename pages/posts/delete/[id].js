import {router} from "next/client";
import Button from "react-bootstrap/Button";


export default function handler(req, res) {
    const id = router.query.id;
    const handleDelete = (e) => {
        e.preventDefault();
        fetch(`http://localhost:3000/api/post/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token"),
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",

            }
        })
            .then(res => res.json())
            .then(data => {
                    console.log(data);
                    router.push("/home");
                }
            )
            .catch((err) => console.log(err));

    }
    return (
        <div>
            <h1>Are you sure you want to delete this post?</h1>
            <br/>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>

            <Button variant="secondary" onClick={() => router.push("/home")}>Cancel</Button>

        </div>
    )


}