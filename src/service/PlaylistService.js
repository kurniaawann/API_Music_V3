const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");



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
}


module.exports = PlayListService