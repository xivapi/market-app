import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import React from "react";

import Home from "./pages/home";
import About from "./pages/about";
import Login from "./pages/login";

export default function Routing()
{
    return (
        <div>
            <div className="container">
                <Router>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light xiv-navbar">
                        <button className="navbar-toggler" type="button" data-toggle="collapse"
                                data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item">
                                    <Link to="/" className="nav-link">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/about" className="nav-link">About</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/login" className="nav-link">Login</Link>
                                </li>
                            </ul>
                        </div>
                    </nav>

                    <Route exact path="/" component={Home} />
                    <Route exact path="/about" component={About} />
                    <Route exact path="/login" component={Login} />
                </Router>
            </div>
        </div>
    );
}
