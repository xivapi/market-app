import Storage from '../xivapi/storage';

/**
 * Interact with XIVAPI
 */
export default new class TokenStorage
{
    constructor() {
        this.ACCOUNT_KEY = 'se_account';
        this.ACCOUNT_TOKENS_KEY = 'se_tokens';
        this.ACCOUNT_CHARACTERS_KEY = 'se_characters';
        this.TOKEN_EXPIRE_HOURS = 18;

        this.CURRENT_ACCOUNT = null;
        this.CURRENT_CHARACTERS = {};
        this.CURRENT_TOKENS = {
            main: null,
            servers: {}
        };

        this.autoload();
    }

    autoload() {
        const account = Storage.fetch(this.ACCOUNT_KEY);
        const tokens = Storage.fetch(this.ACCOUNT_TOKENS_KEY);
        const characters = Storage.fetch(this.ACCOUNT_CHARACTERS_KEY);

        // set tokens
        if (tokens !== null) {
            // todo - remove expired tokens
            this.CURRENT_TOKENS = tokens;
        }

        // set characters
        if (characters !== null) {
            this.CURRENT_CHARACTERS = characters;
        }

        // set characters
        if (account !== null) {
            this.CURRENT_ACCOUNT = account;
        }
    }

    /**
     * Save our current tokens list
     */
    save() {
        Storage.store(this.ACCOUNT_KEY, this.CURRENT_ACCOUNT);
        Storage.store(this.ACCOUNT_TOKENS_KEY, this.CURRENT_TOKENS);
        Storage.store(this.ACCOUNT_CHARACTERS_KEY, this.CURRENT_CHARACTERS);
    }

    /**
     * Get the main token stored
     * @returns {TokenStorage.CURRENT_TOKENS.main|{}}
     */
    getMainToken() {
        return this.CURRENT_TOKENS.main;
    }

    /**
     * Get server tokens
     * @returns {TokenStorage.CURRENT_TOKENS.servers|{}}
     */
    getServerTokens() {
        return this.CURRENT_TOKENS.servers;
    }

    /**
     * Get a token for a specific server
     * @param server
     * @returns {*}
     */
    getServerToken(server) {
        return this.CURRENT_TOKENS.servers[server];
    }

    /**
     * Get the current stored account
     * @returns {null}
     */
    getAccount() {
        return this.CURRENT_ACCOUNT;
    }

    /**
     * Save auto login account
     * @param user
     * @param pass
     */
    setAccount(user, pass) {
        this.CURRENT_ACCOUNT = {
            user: user,
            pass: pass,
        };
        this.save();
    }

    /**
     * Store the main token
     * @param token
     */
    setMainToken(token) {
        this.CURRENT_TOKENS.main = {
            token: token,
            expires: this.getEpochExpiryTime()
        };
        this.save();
    }

    /**
     * Store a server token
     * @param server
     * @param token
     */
    setServerToken(server, token) {
        this.CURRENT_TOKENS.servers[server] = {
            token: token,
            expires: this.getEpochExpiryTime()
        };
        this.save();
    }

    /**
     * Get current stored character list
     * @returns {any}
     */
    getCharacters() {
        return this.CURRENT_CHARACTERS;
    }

    /**
     * Add a character to our active list, this also returns it
     * in the new format
     * @param character
     */
    addCharacter(character) {
        this.CURRENT_CHARACTERS[character.world] = {
            id: character.cid,
            lsid: character.lodestonecid,
            face: character.faceUrl,
            name: character.name,
            server: character.world,
        };
        this.save();
    }

    /**
     * Return the current epoch timestamp
     * @returns {number}
     */
    getEpochTime() {
        return Date.now() / 1000 | 0;
    }

    /**
     * Return the next epoch expiry time
     * @returns {number}
     */
    getEpochExpiryTime() {
        return this.getEpochTime() + (60 * 60 * this.TOKEN_EXPIRE_HOURS);
    }

    /**
     * Get a nice expiry time display
     * @param expiry
     * @returns {string}
     */
    getExpiryTimeDisplay(expiry) {
        return `${moment(expiry * 1000).fromNow()} (${moment(expiry * 1000).format("Do MMM, h:m a")})`;
    }

    /**
     * Returns status of a token expiry check
     * @param token
     * @returns {boolean}
     */
    hasTokenExpired(token) {
        return this.getEpochTime() > token.expires;
    }
}
