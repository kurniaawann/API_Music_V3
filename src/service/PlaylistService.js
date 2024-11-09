const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");



class PlayListService {
    constructor(){
        this._Pool = new Pool();
    }

    async addPlaylist({name,  owner}){
        const id = nanoid(16);
        const playlistId = `playlist-${id}`

        const query = {
            text: "INSERT INTO playlists VALUES ($1, $2, $3) RETURNING id",
            values:[playlistId, name, owner]
        }

        const result = await this._Pool.query(query)
        
        if (!result.rows[0].id) {
            throw InvariantError('Playlist gagal ditambahkan')
        }

        return result.rows[0].id
    }

    async getPlaylist({ owner }) {
        const query = {
            text: `SELECT p.id, p.name, u.username
                FROM playlists p
                LEFT JOIN users u ON u.id = p.owner
                WHERE p.owner = $1`,
            values:[owner]
        };
        
        const result = await this._Pool.query(query)

        if (!result.rowCount) {
            console.log('jalan');
            throw new NotFoundError('Playlist tidak ditemukan');
        }
        return result.rows
    }
}


module.exports = PlayListService