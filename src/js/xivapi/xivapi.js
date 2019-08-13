import Storage from '../xivapi/storage';

/**
 * Interact with XIVAPI
 */
class XIVAPI
{
    autoLogin(user, pass, callback) {
        this.request(`/companion/login?username=${user}&password=${pass}`, callback);
    }

    generateToken(callback) {
        this.request("/companion/token", callback);
    }

    getCharacters(callback) {
        const token = Storage.fetch('character_1');

        if (typeof token === 'undefined') {
            console.error('Attempting to fetch characters without a valid token');
            return;
        }

        // todo - handle region
        this.request(`/companion/characters?token=${token.token}&region=eu`, callback);
    }

    getGameServers(callback) {
        this.request('/servers/dc', callback);
    }

    request(endpoint, callback) {
        // Stone II
        fetch(`https://xivapi.com${endpoint}`, { mode: 'cors' })
            .then(response => response.json())
            .then(data => callback(data))
    }
}

export default new XIVAPI();
