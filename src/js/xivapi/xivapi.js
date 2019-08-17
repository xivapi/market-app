import TokenStorage from '../account/token-storage';
import Servers from './servers';

/**
 * Interact with XIVAPI
 */
class XIVAPI
{
    /**
     * Auto-login to an account
     * @param user
     * @param pass
     * @param callback
     */
    autoLogin(user, pass, callback) {
        this.request(`/companion/login?username=${user}&password=${pass}`, callback);
    }

    /**
     * Manual-login to an account
     * @param callback
     */
    manualLogin(callback) {
        this.generateToken(response => {
            const height    = 720;
            const width     = 500;
            const top       = 250;
            const left      = 250;
            const settings  = [
                'toolbar=no',
                'menubar=no',
                'scrollbars=yes',
                'resizable=yes',
                `width=${width}px`,
                `height=${height}px`,
                `top=${top}`,
                `left=${left}`,
            ];

            window.open(response.LoginUrl, 'targetWindow', settings.join(','));

            if (callback) {
                callback(response);
            }
        });
    }

    /**
     * Generate a new login token and return the login url
     * @param callback
     */
    generateToken(callback) {
        this.request("/companion/token", callback);
    }

    /**
     * Fetch a list of characters on the account
     * @param callback
     */
    getCharacters(callback) {
        const mainToken = TokenStorage.getMainToken();
        if (mainToken === null) {
            console.error('Attempting to fetch characters without a valid token');
            return;
        }

        // region does not matter when fetching character list
        this.request(`/companion/characters?token=${mainToken.token}&region=eu`, callback);
    }

    /**
     * Login to a specific character
     * @param character
     * @param callback
     */
    loginCharacter(character, callback) {
        const serverToken = TokenStorage.getServerToken(character.server);
        if (serverToken === null) {
            console.error('Attempting to fetch token for server: ' + character.server);
            return;
        }

        const region = Servers.getRegionForServer(character.server);
        const cid = character.id;

        // region does not matter when fetching character list
        this.request(`/companion/character/login?token=${serverToken.token}&region=${region}&character_id=${cid}`, callback);
    }

    /**
     * Get server list
     * @param callback
     */
    getGameServers(callback) {
        this.request('/servers/dc', callback);
    }

    /**
     * Get item prices
     * @param itemId
     * @param server
     * @param callback
     */
    getItemPrices(itemId, server, callback) {
        const serverToken = TokenStorage.getServerToken(server);
        const region = Servers.getRegionForServer(server);

        if (serverToken === null) {
            console.error('Attempting to fetch token for server: ' + character.server);
            return;
        }

        this.request(`/companion/market/item/prices?token=${serverToken.token}&region=${region}&item_id=${itemId}&server=${server}`, callback);
    }

    /**
     * Get item prices
     * @param itemId
     * @param server
     * @param callback
     */
    getItemHistory(itemId, server, callback) {
        const serverToken = TokenStorage.getServerToken(server);
        const region = Servers.getRegionForServer(server);

        if (serverToken === null) {
            console.error('Attempting to fetch token for server: ' + character.server);
            return;
        }

        this.request(`/companion/market/item/history?token=${serverToken.token}&region=${region}&item_id=${itemId}&server=${server}`, callback);
    }

    /**
     * Generic request handler
     * @param endpoint
     * @param callback
     */
    request(endpoint, callback) {
        // Stone II
        fetch(`https://xivapi.com${endpoint}`, { mode: 'cors' })
            .then(response => response.json())
            .then(data => callback(data))
    }
}

export default new XIVAPI();
