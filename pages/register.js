import { useState } from "react";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/router";
import {Form} from "react-bootstrap";


const Register = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [username, setUsername] = useState("");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [email, setEmail] = useState("");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [password, setPassword] = useState("");

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();

    // eslint-disable-next-line react-hooks/rules-of-hooks
   const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const handleUsername = (e) => {
        setUsername(e.target.value);

    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const handlePassword = (e) => {
        setPassword(e.target.value);

    }

    // eslint-disable-next-line react-hooks/rules-of-hooks

    const handleBack = () => {
        router.push("/login").then(r =>
            console.log(r));
    };

    const register = (e) => {
        e.preventDefault();
        const user = {
            username,
            email,
            password,
            role: "user"
        };
        fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message === "User created") {
                    router.push("/login").then(r => console.log(r));
                } else if (data.message === "User already exists") {
                    alert("Email already exists");
                } else if (data.message === "Fill in all fields") {
                    alert("Please fill in all fields");
                } else {
                    alert("Something went wrong");
                }
            })
            .catch((err) => console.log(err));
    };

    return (
        <div>
            <div>
                <h1 style={{color: "goldenrod", textAlign: "center"}}>Register</h1>
                <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter username" onChange={handleUsername}/>
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" onChange={handleEmail}/>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={handlePassword}/>
                    </Form.Group>
                    <Button variant="primary" type="submit" onClick={register}>
                        Register
                    </Button>
                    <Button variant="primary"  onClick={handleBack}>
                        Login
                    </Button>
                </Form>

            </div>
        </div>
    );
};


export default Register;