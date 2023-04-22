import { useState } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/router";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleBack = () => {
        router.push("/register").then(r =>
            console.log(r));
    };

    const login = (e) => {
        e.preventDefault();
        const user = {
            email,
            password,
        };
        fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message === "User logged in") {
                    localStorage.setItem("token", data.data.token);
                    localStorage.setItem("role", data.data.role);
                    router.push("/").then(r => console.log(r));
                } else if (data.errors[0].msg === "Invalid credentials") {
                    alert("Invalid credentials");
                } else {
                    alert("Fill in all fields");
                }
            })
            .catch((err) => console.log(err));
    };



    return (
        <div>
            <div>
                <h1 style={{ color: "goldenrod", textAlign: "center" }}>Login</h1>
            </div>

            <div className="container">
                <div className="row">
                    <div className="col-md-6 mt-5 mx-auto">
                        <Form style={{ width: "50%", margin: "auto" }}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label style={{ color: "goldenrod" }}>
                                    Email address
                                </Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    name="email"
                                    onChange={handleEmail}
                                />
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label style={{ color: "goldenrod" }}>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    onChange={handlePassword}
                                />
                            </Form.Group>
                            <Button
                                variant="outline-success"
                                style={{ margin: "10px" }}
                                type="submit"
                                onClick={login}
                            >
                                Login
                            </Button>
                            <Button
                                variant="outline-success"
                                style={{ margin: "10px" }}
                                type="button"
                                onClick={handleBack}
                            >
                                Register
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
