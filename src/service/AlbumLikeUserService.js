const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const ClientError = require("../exceptions/ClientError");
const NotFoundError = require("../exceptions/NotFoundError");
class AlbumLikeUserService {
    constructor(){
    this._Pool = new Pool();
    }

    async addAlbumLikeUser(albumId, userId) {
        // Cek apakah pengguna sudah menyukai album tersebut
        const checkQuery = {
            text: 'SELECT * FROM user_album_like WHERE user_id = $1 AND album_id = $2',
            values: [userId, albumId],
        };
    
        const checkResult = await this._Pool.query(checkQuery);
        if (checkResult.rows.length > 0) {
            throw new ClientError("Anda sudah menyukai album ini.");
        }
    
        // Menambahkan like jika belum ada
        const id = nanoid(16);
        const albumLikeUserId = `albumLikeUser-${id}`;
    
        const query = {
            text: 'INSERT INTO user_album_like VALUES ($1, $2, $3) RETURNING id',
            values: [albumLikeUserId, userId, albumId],
        };
    
        const result = await this._Pool.query(query);
        if (!result.rows[0].id) {
            throw new InvariantError("Album Like gagal ditambahkan");
        }
    }

    async deleteAlbumLikeUser(albumId){
        const query = {
            text:'DELETE FROM user_album_like WHERE album_id = $1',
            values:[albumId]
        };
        const result = await this._Pool.query(query);
  
        if (!result.rowCount) {
        throw new NotFoundError(`Album tidak ditemukan.`);
        }
    }
    async getAlbumLikeUser(userId, albumId){
        const query = {
            text:'SELECT * FROM user_album_like WHERE user_id = $1 AND album_id = $2',
            values: [userId, albumId],
        };
        const result = await this._Pool.query(query);
  
        if (!result.rowCount) {
        throw new NotFoundError(`Album tidak ditemukan.`);
        }
        return result.rowCount
    }
}

module.exports = AlbumLikeUserService