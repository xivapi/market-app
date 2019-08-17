import React, { useState, useEffect } from 'react';
import TokenStorage from './token-storage';
import XIVAPI from '../xivapi/xivapi';
import Servers from '../xivapi/servers';

export default function Account() {
    const LOGIN_BUTTON = 'Login via Square-Enix Account';
    const LOGIN_BUTTON_ACTIVE = 'Fetching Square-Enix Account login form, please wait...';
    const FORM_SUBMIT = 'Login to Account';
    const FORM_SUBMIT_ACTIVE = 'Logging into your account, please wait...';

    // data
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [tokenMain, setTokenMain] = useState(null);
    const [tokenServers, setTokenServers] = useState(null);
    const [loginUrl, setLoginUrl] = useState(null);
    const [characters, setCharacters] = useState([]);
    const [activeCharacters, setActiveCharacters] = useState({});
    const [autoLoginActive, setAutoLoginActive] = useState(false);

    // ui states
    const [waitA, setWaitA] = useState(false);
    const [waitB, setWaitB] = useState(false);
    const [waitC, setWaitC] = useState(false);

    useEffect(() => {
        // set the main token
        setTokenMain(TokenStorage.getMainToken());
        setTokenServers(TokenStorage.getServerTokens());
        setActiveCharacters(TokenStorage.getCharacters());

        const account = TokenStorage.getAccount();

        if (account !== null) {
            setUsername(account.user);
            setPassword(account.pass);
        }
    });

    // Login by providing a link to the SE Login form
    function handleLoginButtonClick() {
        setWaitA(true);

        XIVAPI.manualLogin(response => {
            TokenStorage.setMainToken(response.Token.token);

            setWaitA(false);
            setTokenMain(TokenStorage.getMainToken());
            setLoginUrl(response.LoginUrl);
        });
    }

    // Login using the users: Username + Password
    function handleLoginFormSubmit(event) {
        setWaitB(true);
        setAutoLoginActive(false);
        event.preventDefault();

        XIVAPI.autoLogin(username, password, response => {
            TokenStorage.setMainToken(response.Token.token);
            TokenStorage.setAccount(username, password);

            setWaitB(false);
            setAutoLoginActive(true);
            setTokenMain(TokenStorage.getMainToken());
        });
    }

    // Fetch character list
    function handleCharacterFetch() {
        setWaitC(true);

        XIVAPI.getCharacters(response => {
            // hard coded to account 0
            setCharacters(response.Characters.accounts[0].characters);
        });
    }

    // User selects a character to use
    function selectCharacter(character) {
        TokenStorage.addCharacter(character);
        setActiveCharacters({});
    }

    // User wants to auto-login to character
    function handleAutoLoginCharacter(button, character) {
        // disable button
        button.disabled = true;

        XIVAPI.autoLogin(username, password, response => {
            // store token against server
            TokenStorage.setServerToken(
                character.server,
                response.Token.token
            );

            XIVAPI.loginCharacter(character, response => {
                setActiveCharacters({});
            });
        });
    }

    // User wants to manually login to character
    function handleManualLoginCharacter(button, character) {
        // disable button
        button.disabled = true;

        // popup a manual login to generate a new character token
        XIVAPI.manualLogin(response => {
            // store token against server
            TokenStorage.setServerToken(
                character.server,
                response.Token.token
            );

            // due to cookies, we can assume after about 6 seconds
            // todo - handle situations when cookies don't auto login
            setTimeout(() => {
                // login to character
                XIVAPI.loginCharacter(character, response => {
                    setActiveCharacters({});
                });
            }, 6000);
        });
    }

    return (
        <div>
            <h1>Login using your Square-Enix Account</h1>
            <br/>
            <p>
                Once you have logged in using either <strong>Auto-Login</strong> or
                using <strong>Manual Login</strong> you will be provided a token that
                lasts roughly 24 hours. The 1st login will be performed to fetch
                a list of characters after which you will need to login for
                every single character there-after, every day you want to use this tool.
            </p>
            <p>
                <div className="alert alert-secondary" role="alert">
                    <small>
                        <strong>NOTE:</strong> Buttons and actions which must interact with the Companion API
                        will be slow, please allow time for actions to be completed.
                    </small>
                </div>
            </p>

            <br/>

            <div className="row">
                <div className="col-md-6">
                    <form autoComplete="off" className="card" onSubmit={handleLoginFormSubmit}>
                        <div className="card-body">
                            <h4 className="text-primary">Auto-Login</h4>
                            <p>
                                Using auto login makes it a lot simpler when you need to login to each server
                                every single day.
                            </p>
                            <div className="row">
                                <div className="col-md">
                                    <div className="form-group">
                                        <label htmlFor="se_username">SE Account Username</label>
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            value={username}
                                            onChange={event => setUsername(event.target.value)}
                                            className="form-control"
                                            id="se_username"
                                        />
                                    </div>
                                </div>
                                <div className="col-md">
                                    <div className="form-group">
                                        <label htmlFor="se_password">Password</label>
                                        <input
                                            type="password"
                                            autoComplete="off"
                                            value={password}
                                            onChange={event => setPassword(event.target.value)}
                                            className="form-control"
                                            id="se_password"
                                        />
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
                            <br/><br/>
                            {autoLoginActive && <div>
                                <div className="alert alert-success" role="alert">
                                    Auto login complete! Main Token generated
                                </div>
                            </div>}
                        </div>
                    </form>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="text-primary">Manual Login</h4>
                            <p>
                                Use the button below to generate a token and open the official Square-Enix login form.
                                This login is on SE's servers and is the most secure way of logging into this site.
                            </p>
                            <div className="form-group">
                                <small>
                                    Once you have logged in the form will redirect you to a page that will either respond with:&nbsp;
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
                                <strong>Login Link</strong>
                                <br/>
                                {loginUrl && <a href={loginUrl} target="_blank">{loginUrl.substr(0, 120)}</a>}
                                {!loginUrl && <div><em>Not generated, click the login button above to generate a login link.</em></div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <br/><br/>

            <h4>Select your characters</h4>
            <p>
                Once you have logged in and have a valid token, you can request your characters. Here you will
                be able to decide which characters you would like to use. If you have logged in recently using
                this browser then performing a "Manual" login will very likely use your browser cookies to
                auto-login you in.
            </p>

            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <table className="table table-bordered">
                                <thead>
                                <tr>
                                    <th scope="col" colSpan="4">Account Characters</th>
                                </tr>
                                </thead>
                                <tbody>
                                {tokenMain == null && <tr>
                                    <td colSpan="4">
                                        <em>You must login at least once for a main token to be able to populate characters</em>
                                    </td>
                                </tr>}

                                {tokenMain && characters.length === 0 && <tr>
                                    <td colSpan="4">
                                        <button className="btn btn-outline-secondary" disabled={waitC || !tokenMain} onClick={handleCharacterFetch}>
                                            Fetch account characters
                                        </button>
                                    </td>
                                </tr>}

                                {characters.map((character, index) => {
                                    return <tr key={index}>
                                        <td width="5%"><img src={character.faceUrl} height="42" alt="face" className="xiv-table-avatar" /></td>
                                        <td><strong>{character.name}</strong></td>
                                        <td>{character.world}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={event => { selectCharacter(character) }}>
                                                SELECT
                                            </button>
                                        </td>
                                    </tr>
                                })}
                                </tbody>
                            </table>
                        </div>
                        <div className="col-md-6">
                            <table className="table table-bordered">
                                <thead>
                                <tr>
                                    <th scope="col" colSpan="2">
                                        Active Characters ({Object.keys(activeCharacters).length})
                                    </th>
                                </tr>
                                </thead>
                                <tbody>

                                {Object.keys(activeCharacters).length === 0 && <tr>
                                    <td colSpan="4">
                                        <em>No active characters</em>
                                    </td>
                                </tr>}

                                {Object.keys(activeCharacters).map((server, index) => {
                                    const character = activeCharacters[server];
                                    const token = tokenServers[server];
                                    const region = Servers.getRegionForServer(server);

                                    return <tr key={index}>
                                        <td width="5%">
                                            <img src={character.face} height="42" alt="face" className="xiv-table-avatar" />
                                        </td>
                                        <td>
                                            <h6 className="text-secondary">
                                                <strong>{character.name}</strong> - <em>({region.toUpperCase()}) {character.server}</em>
                                            </h6>
                                            <div>
                                                {token && <small>
                                                    <div>
                                                        <strong>Expires:</strong> {TokenStorage.getExpiryTimeDisplay(token.expires)}
                                                    </div>
                                                    <div>
                                                        {token.token}
                                                    </div>
                                                </small>}

                                                {!token && <div>
                                                    Login:
                                                    {username && <span>
                                                        &nbsp;&nbsp;
                                                        <button className="btn btn-sm btn-primary"
                                                                onClick={event => {
                                                                    handleManualLoginCharacter(event.target, character)
                                                                }}>
                                                                MANUAL
                                                        </button>
                                                    </span>}
                                                    &nbsp;&nbsp;
                                                    <button className="btn btn-sm btn-success"
                                                            onClick={event => {
                                                                handleAutoLoginCharacter(event.target, character)
                                                            }}>
                                                            AUTO
                                                    </button>
                                                </div>}
                                            </div>
                                        </td>
                                    </tr>
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <br/><br/>

            <h4>Tokens</h4>
            <p>This is a list of your current active login tokens.</p>

            <div>
                <table className="table table-bordered">
                    <thead>
                    <tr>
                        <th scope="col" width="40%">Token</th>
                        <th scope="col">Expires</th>
                        <th scope="col">Server</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tokenMain == null && <tr>
                        <td colSpan="4">No main login token (Only required to refresh character list).</td>
                    </tr>}

                    {tokenMain && <tr>
                        <td><strong className="text-success">{tokenMain.token}</strong></td>
                        <td>{TokenStorage.getExpiryTimeDisplay(tokenMain.expires)}</td>
                        <td><em>(MainKey)</em></td>
                    </tr>}

                    {tokenServers && Object.keys(tokenServers).map((server, index) => {
                        const token = tokenServers[server];

                        return <tr key={index}>
                            <td><strong className="text-success">{token.token}</strong></td>
                            <td>{TokenStorage.getExpiryTimeDisplay(token.expires)}</td>
                            <td>{server}</td>
                        </tr>
                    })}
                    </tbody>
                </table>
            </div>

            <br/><br/>

        </div>
    )
}
