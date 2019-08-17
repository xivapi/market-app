/**
 * Server info from XIVAPI
 * - https://xivapi.com/servers/dc
 * -
 */
class Servers {
    constructor() {
        this.REGION_SERVERS = {
            "na": [
                "Adamantoise",
                "Cactuar",
                "Faerie",
                "Gilgamesh",
                "Jenova",
                "Midgardsormr",
                "Sargatanas",
                "Siren",
                "Behemoth",
                "Excalibur",
                "Exodus",
                "Famfrit",
                "Hyperion",
                "Lamia",
                "Leviathan",
                "Ultros",
                "Balmung",
                "Brynhildr",
                "Coeurl",
                "Diabolos",
                "Goblin",
                "Malboro",
                "Mateus",
                "Zalera"
            ],
            "eu": [
                "Lich",
                "Odin",
                "Phoenix",
                "Shiva",
                "Zodiark",
                "Twintania",
                "Cerberus",
                "Louisoix",
                "Moogle",
                "Omega",
                "Ragnarok",
                "Spriggan"
            ],
            "jp": [
                "Aegis",
                "Atomos",
                "Carbuncle",
                "Garuda",
                "Gungnir",
                "Kujata",
                "Ramuh",
                "Tonberry",
                "Typhon",
                "Unicorn",
                "Alexander",
                "Bahamut",
                "Durandal",
                "Fenrir",
                "Ifrit",
                "Ridill",
                "Tiamat",
                "Ultima",
                "Valefor",
                "Yojimbo",
                "Zeromus",
                "Anima",
                "Asura",
                "Belias",
                "Chocobo",
                "Hades",
                "Ixion",
                "Mandragora",
                "Masamune",
                "Pandaemonium",
                "Shinryu",
                "Titan"
            ],
        };

        this.DC_SERVERS = {
            "Aether": [
                "Adamantoise",
                "Cactuar",
                "Faerie",
                "Gilgamesh",
                "Jenova",
                "Midgardsormr",
                "Sargatanas",
                "Siren"
            ],
            "Chaos": [
                "Cerberus",
                "Louisoix",
                "Moogle",
                "Omega",
                "Ragnarok",
                "Spriggan"
            ],
            "Crystal": [
                "Balmung",
                "Brynhildr",
                "Coeurl",
                "Diabolos",
                "Goblin",
                "Malboro",
                "Mateus",
                "Zalera"
            ],
            "Elemental": [
                "Aegis",
                "Atomos",
                "Carbuncle",
                "Garuda",
                "Gungnir",
                "Kujata",
                "Ramuh",
                "Tonberry",
                "Typhon",
                "Unicorn"
            ],
            "Gaia": [
                "Alexander",
                "Bahamut",
                "Durandal",
                "Fenrir",
                "Ifrit",
                "Ridill",
                "Tiamat",
                "Ultima",
                "Valefor",
                "Yojimbo",
                "Zeromus"
            ],
            "Light": [
                "Lich",
                "Odin",
                "Phoenix",
                "Shiva",
                "Zodiark",
                "Twintania"
            ],
            "Mana": [
                "Anima",
                "Asura",
                "Belias",
                "Chocobo",
                "Hades",
                "Ixion",
                "Mandragora",
                "Masamune",
                "Pandaemonium",
                "Shinryu",
                "Titan"
            ],
            "Primal": [
                "Behemoth",
                "Excalibur",
                "Exodus",
                "Famfrit",
                "Hyperion",
                "Lamia",
                "Leviathan",
                "Ultros"
            ]
        };
    }

    /**
     * Get region for a specific server
     * @param server
     * @returns {null|*}
     */
    getRegionForServer(server) {
        for (let region in this.REGION_SERVERS) {
            if (this.REGION_SERVERS[region].indexOf(server) > -1) {
                return region;
            }
        }

        return null;
    }
}

export default new Servers();
