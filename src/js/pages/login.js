import React, { useState, useEffect } from 'react';
import XIVAPI from '../xivapi/xivapi';

export default function Login()
{
    const LOGIN_BUTTON = 'Login via Square-Enix Account';
    const LOGIN_BUTTON_ACTIVE = 'Fetching Square-Enix Account login form, please wait...';

    // data
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState("Not Generated");
    const [loginUrl, setLoginUrl] = useState(null);

    // ui states
    const [fetchingLoginFormStatus, setFetchLoginFormStatus] = useState(false);

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {

    });

    // Login using the users: Username + Password
    function handleLoginFormSubmit(event) {
        event.preventDefault();

        console.log('Form Submit')
    }

    // Login by providing a link to the SE Login form
    function handleLoginButtonClick() {
        setFetchLoginFormStatus(true);

        XIVAPI.generateCompanionToken(response => {
            setFetchLoginFormStatus(false);

            setToken(response.Token.token);
            setLoginUrl(response.LoginUrl);
        });
    }

    return (
        <div>
            <h4>Login to your Square-Enix FFXIV Account</h4>

            <br/>

            <form className="card" onSubmit={handleLoginFormSubmit}>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md">
                            <div className="form-group">
                                <label htmlFor="username">SE Account Username</label>
                                <input type="text" autoComplete="username" value={username} onChange={event => setUsername(event.target.value)} className="form-control" id="username"/>
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} className="form-control" id="password" />
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <small>
                            Accounts with OTP are not currently supported using the login form above. If you wish to use
                            an account with OTP please use the SE Login Link method.
                        </small>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </div>
            </form>

            <div className="card">
                <div className="card-body">
                    <p>
                        Use the button below to generate a token and open the official Square-Enix login form.
                        This login is on SE's servers and is the most secure way of logging into this site.
                    </p>
                    <div className="form-group">
                        <small>
                            Once you have logged in the form will redirect you to a page that will either respodn with:&nbsp;
                            <code>200</code> or <code>202</code>, this means you have successfully logged in. The code
                            is used by the Companion App to handle the next steps after login.
                        </small>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary" disabled={fetchingLoginFormStatus} onClick={handleLoginButtonClick}>
                            {fetchingLoginFormStatus ? LOGIN_BUTTON_ACTIVE : LOGIN_BUTTON}
                        </button>
                    </div>
                    <div className="form-group">
                        <ul>
                            <li><strong>Token:</strong> {token}</li>
                            <li><strong>Login URL:</strong> {loginUrl && <a href={loginUrl}>{loginUrl.substr(0, 120)}</a> }</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
