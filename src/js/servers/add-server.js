import React, { useState, useEffect } from 'react';
import XIVAPI from '../xivapi/xivapi';

export default function AddServer() {
    const [serverList, setServerList] = useState([]);
    const [server, setServer] = useState('');

    function handleCharacterSubmit(event) {
        event.preventDefault();
    }

    useEffect(() => {
        if (serverList.length === 0) {
            XIVAPI.getGameServers(response => {
                setServerList(response);

                console.log(response);
            });
        }
    });

    return (
        <div>
            <form className="card" onSubmit={handleCharacterSubmit}>
                <div className="card-body">
                    <div className="form-group">
                        <label htmlFor="server">Server</label>

                        <select className="form-control" onChange={event => setServer(event.target.value)}>
                            {Object.keys(serverList).map((dcName, i) => {
                                return <optgroup label={dcName} key={i}>
                                    {serverList[dcName].map((serverName, j) => {
                                        return <option value={serverName} key={serverName}>{serverName}</option>
                                    })}
                                </optgroup>
                            })}
                        </select>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary">Add Server</button>
                    </div>
                </div>
            </form>
        </div>
    )
}
