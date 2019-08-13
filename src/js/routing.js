import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import React from "react";

import Home from "./pages/home";
import Servers from "./servers/servers";

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
                                <li className="nav-item">
                                    <Link to="/servers" className="nav-link">Servers</Link>
                                </li>
                            </ul>
                        </div>
                    </nav>

                    <Route exact path="/" component={Home} />
                    <Route exact path="/servers" component={Servers} />
                </Router>
            </div>
        </div>
    );
}
