/**
 * Interact with XIVAPI
 */
class Storage
{
    store(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    fetch (key) {
        return JSON.parse(
            localStorage.getItem(key)
        );
    }
}

export default new Storage();
