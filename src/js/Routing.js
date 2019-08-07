import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import Home from "./Home";
import About from "./About";
import React from "react";

export default function Routing() {
    return (
        <div>
            <Router>
                <div>
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                </div>

                <hr />

                <Route exact path="/" component={Home} />
                <Route exact path="/about" component={About} />
            </Router>

        </div>
    );
}
