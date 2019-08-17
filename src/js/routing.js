import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import React from "react";

import Home from "./pages/home";
import Account from "./account/account";

export default function Routing()
{
    return (
        <div>
            <div className="container">
                <Router>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light xiv-navbar">
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item">
                                    <Link to="/" className="nav-link">Home</Link>
                                </li>
                            </ul>

                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <Link to="/account" className="nav-link">Account</Link>
                                </li>
                            </ul>
                        </div>
                    </nav>

                    <Route exact path="/" component={Home} />
                    <Route exact path="/account" component={Account} />
                </Router>
            </div>
        </div>
    );
}
