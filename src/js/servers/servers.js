import React from 'react';
import AddServer from './add-server';

export default function Servers() {
    return (
        <div>
            <h4>Servers</h4>

            <p>
                You can store up to 8 servers which can be used for cross-world pricing. To allow this, you
                must create 1 character per world. The character does not need to have done anything (not even
                finish the starting cutscene or quest).
            </p>

            <p>
                Select which servers you would like to use and you can then login to all of them with a
                single click.
            </p>

            <p>
                A login token will last a maximum of 24 hours before it expires.
            </p>

            <AddServer />

        </div>
    )
}
