/**
 * Interact with XIVAPI
 */
class XIVAPI
{
    generateCompanionToken(callback)
    {
        this.request("/companion/token", callback);
    }


    request(endpoint, callback)
    {
        // Stone II
        fetch(`https://xivapi.com${endpoint}`, { mode: 'cors' })
            .then(response => response.json())
            .then(data => callback(data))
    }
}

export default new XIVAPI();
