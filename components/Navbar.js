import React from "react";
import {Nav, Navbar, NavLink} from "react-bootstrap";
import Link from "next/link";



const NavigationBar = () => {
    const logout = () => {
        localStorage.clear();
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        window.location.href = "/login";
    };

    return (
        <div style={{margin:"80px"}}>

            {localStorage.getItem("role")==="admin" ? (
                <Navbar bg="dark" variant="dark" expand="lg" fixed={"top"}>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            //search bar
                            <Nav.Item>
                                <Link href="/home" className="nav-link">
                                    Home
                                </Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Link href="/write" className="nav-link">
                                    Write
                                </Link>
                            </Nav.Item>
                            <Nav.Item>
                                <NavLink  className="nav-link" onClick={logout}>
                                    Logout
                                </NavLink>
                            </Nav.Item>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            ) : (
                <Navbar bg="dark" variant="dark" expand="lg" fixed={"top"}>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Item>
                                <Link href="/home" className="nav-link">
                                    Home
                                </Link>
                            </Nav.Item>
                            <Nav.Item>
                                <NavLink  className="nav-link" onClick={logout}>
                                    Logout
                                </NavLink>
                            </Nav.Item>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            )}
        </div>
    );
};

export default NavigationBar;