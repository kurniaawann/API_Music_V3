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

    async addPlaylistAndSongs(songId, id, {owner}){
        const generatedId = nanoid(16);
        const plylistAndSongId = `playlistAndSong-${generatedId}`;
        const getSongId = await this.checkAndGetSongId(songId)

        const query = {
            text: "INSERT INTO playlist_songs VALUES ($1, $2, $3, $4)",
            values:[plylistAndSongId, id, getSongId, owner],
        }

        await this._Pool.query(query);

    }


    async checkAndGetSongId(songId){
        const query = {
            text:'SELECT id FROM song WHERE id = $1',
            values:[songId]
        }
        
        const result = await this._Pool.query(query);
       
        if (!result.rowCount) {
            throw new NotFoundError("Id song tidak ditemukan");
        }
        
        return result.rows[0].id;
    }


    async verifiyPlaylistOwner(id,owner){
        const query = {
          text:'SELECT owner FROM playlists WHERE id = $1',
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
    
      async getPlaylistAndSong(id) {
        const query = {
            text: `
            SELECT 
                playlist_songs.*,
                song.id AS song_id,
                song.title AS song_title,
                song.performer AS song_performer,
                playlists.name AS playlist_name,
                users.username AS owner_username
            FROM 
                playlist_songs
                JOIN song ON song.id = playlist_songs.song_id
                JOIN playlists ON playlists.id = playlist_songs.playlist_id
                JOIN users ON users.id = playlists.owner
            WHERE 
                playlist_songs.playlist_id = $1;`,
            values: [id],
        };
    
        const result = await this._Pool.query(query);
    
        if (!result.rowCount) {
            throw new NotFoundError('Playlist dan songs tidak ditemukan');
        }
    
        // Mengelompokkan data menjadi format yang diinginkan
        const playlistData = result.rows.reduce((acc, row) => {
            if (!acc.id) {
                acc.id = row.playlist_id;
                acc.name = row.playlist_name;
                acc.username = row.owner_username;
                acc.songs = [];
            }
            acc.songs.push({
                id: row.song_id,
                title: row.song_title,
                performer: row.song_performer,
            });
            return acc;
        }, {});
    
        return playlistData;
    }
    
    async deleteSongFromPlaylist(id){
        const query = {
            text:'DELETE FROM song WHERE id = $1',
            values:[id]
        }

        const result = await this._Pool.query(query)

        if (!result.rowCount) {
            throw new NotFoundError("Playlist and song gagal dihapus id tidak ditemukan");
        }
    }


}


module.exports = PlayListService