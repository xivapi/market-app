import React, { useState, useEffect } from 'react';
import XIVAPI from '../xivapi/xivapi';
import Storage from '../xivapi/storage';

export default function Login()
{
    const LOGIN_BUTTON = 'Login via Square-Enix Account';
    const LOGIN_BUTTON_ACTIVE = 'Fetching Square-Enix Account login form, please wait...';
    const FORM_SUBMIT = 'Login to Account';
    const FORM_SUBMIT_ACTIVE = 'Logging into your account, please wait...';

    // data
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState(null);
    const [loginUrl, setLoginUrl] = useState(null);
    const [characters, setCharacters] = useState([]);

    // ui states
    const [waitA, setWaitA] = useState(false);
    const [waitB, setWaitB] = useState(false);
    const [waitC, setWaitC] = useState(false);

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        if (token === null) {
            var storedToken = Storage.fetch('character_1');

            console.log(storedToken);

            if (storedToken !== null) {
                setToken(storedToken.token);
            }
        }
    });

    // Login by providing a link to the SE Login form
    function handleLoginButtonClick() {
        setWaitA(true);

        XIVAPI.generateToken(response => {
            setWaitA(false);
            setToken(response.Token.token);
            setLoginUrl(response.LoginUrl);

            Storage.store('character_1', {
                token: response.Token.token
            });

            const height = 720;
            const width  = 500;
            const top    = (screen.height/2)-(height/2);
            const left   = (screen.width/2)-(width/2);

            const windowSettings = [
                'toolbar=no',
                'menubar=no',
                'scrollbars=yes',
                'resizable=yes',
                `width=${width}px`,
                `height=${height}px`,
                `top=${top}`,
                `left=${left}`,
            ];

            // open
            window.open(response.LoginUrl, 'targetWindow', windowSettings.join(','))
        });
    }

    // Login using the users: Username + Password
    function handleLoginFormSubmit(event) {
        setWaitB(true);
        event.preventDefault();

        XIVAPI.autoLogin(username, password, response => {
            setWaitB(false);
            setToken(response.Token.token);

            Storage.store('character_1', {
                token: response.Token.token
            });
        });
    }

    // Fetch character list
    function handleCharacterFetch() {
        setWaitC(true);

        XIVAPI.getCharacters(response => {
            setCharacters(response.Characters.accounts[0].characters);
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
                                <label htmlFor="se_username">SE Account Username</label>
                                <input type="text" autoComplete="se_username" value={username} onChange={event => setUsername(event.target.value)} className="form-control" id="se_username"/>
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="form-group">
                                <label htmlFor="se_password">Password</label>
                                <input type="password" autoComplete="se_password" value={password} onChange={event => setPassword(event.target.value)} className="form-control" id="se_password" />
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <small>
                            Accounts with OTP are not currently supported using the login form above. If you wish to use
                            an account with OTP please use the SE Login Link method.
                        </small>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={waitB}>
                        {waitB ? FORM_SUBMIT_ACTIVE : FORM_SUBMIT}
                    </button>
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
                        <button className="btn btn-primary" disabled={waitA} onClick={handleLoginButtonClick}>
                            {waitA ? LOGIN_BUTTON_ACTIVE : LOGIN_BUTTON}
                        </button>
                    </div>
                    <div className="form-group">
                        <ul>
                            <li><strong>Token:</strong> {token ? token : 'Not Generated'}</li>
                            <li><strong>Login URL:</strong> {loginUrl && <a href={loginUrl} target="_blank">{loginUrl.substr(0, 120)}</a> }</li>
                        </ul>
                    </div>
                </div>
            </div>

            <br/><hr/><br/>

            <h4>Select your character</h4>
            <p>Once you have logged in and have a valid token, you can request your characters.</p>

            {token && <div>
                <button className="btn btn-primary" disabled={waitC} onClick={handleCharacterFetch}>
                    Fetch characters
                </button>

                <br/><br/>

                <h5>Characters</h5>

                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col" width="1%">#</th>
                            <th scope="col" width="5%">Face</th>
                            <th scope="col">Name</th>
                            <th scope="col">Server</th>
                        </tr>
                    </thead>
                    <tbody>
                        {characters.map((character, index) => {
                            return <tr>
                                <td>{index}</td>
                                <td><img src={character.faceUrl} height="42" alt="face" /></td>
                                <td>{character.name}</td>
                                <td>{character.world}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>}
            <br/><br/>
        </div>
    )
}
