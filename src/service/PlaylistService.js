const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const AuthorizationError = require("../exceptions/AuthorizationError");



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
                INNER JOIN users u ON u.id = p.owner
                WHERE p.owner = $1`,
            values:[owner]
        };
        
        const result = await this._Pool.query(query)

        if (!result.rowCount) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }
        return result.rows
    }

    async deletePlaylistByid(id){
        const query = {
            text:'DELETE FROM playlists WHERE id = $1',
            values:[id],
        }

        const result = await this._Pool.query(query)

        if (!result.rowCount) {
            throw new NotFoundError("Playlist gagal dihapus id tidak ditemukan");
        }
    }

    async addPlaylistAndSongs(songsId, id, {owner}){
        const generatedId = nanoid(16);
        const plylistAndSongId = `playlistAndSong-${generatedId}`;
        const getSongId = await this.checkAndGetSongId(songsId)

        const query = {
            text: "INSERT INTO playlist_songs VALUES ($1, $2, $3, $4)",
            values:[plylistAndSongId, id, getSongId, owner],
        }

        await this._Pool.query(query);

    }


    async checkAndGetSongId(songsId){
        const query = {
            text:'SELECT id FROM song WHERE id = $1',
            values:[songsId]
        }
        
        const result = await this._Pool.query(query);
       
        if (!result.rowCount) {
            throw new NotFoundError("Id song tidak ditemukan");
        }

        if (result.rows[0].id === songsId) {
            throw new InvariantError("Id yang dimasukkan harus berbeda"); 
        }
        return result.rows[0].id;
    }


    async verifiyOwner(id,owner){
        const query = {
          text:'SELECT id FROM playlists WHERE id = $1',
          values:[id]
        };
        const result = await this._Pool.query(query);
        
        if (!result.rows.length) {
          throw new NotFoundError('Playlist tidak ditemukan');
        }
    
        const palylist = result.rows[0];

    
        if (palylist.owner !== owner) {
          throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
      }


}


module.exports = PlayListService