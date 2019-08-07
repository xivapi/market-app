import React, { useState, useEffect } from 'react';

export default function Home() {
    const [count, setCount] = useState(0);
    const [name, setName] = useState('fred');

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        // Update the document title using the browser API
        document.title = `You clicked ${count} times`;
    });


    return (
        <div>
            <h4>HomePage</h4>

            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>Click meee</button>

            <br/><br/>

            <p>Your name is: {name}</p>
            <input value={name} onChange={event => setName(event.target.value)} />


        </div>
    )
}
