const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const ClientError = require("../exceptions/ClientError");
const NotFoundError = require("../exceptions/NotFoundError");
class AlbumLikeUserService {
    constructor(cachheService){
        this._Pool = new Pool();
        this._cacheService = cachheService;
    }

    async addAlbumLikeUser(albumId, userId) {
        const checkQuery = {
            text: 'SELECT * FROM user_album_like WHERE user_id = $1 AND album_id = $2',
            values: [userId, albumId],
        };
    
        const checkResult = await this._Pool.query(checkQuery);
        if (checkResult.rows.length > 0) {
            throw new ClientError("Anda sudah menyukai album ini.");
        }
    
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
        await this._cacheService.delete(`albumLikeUser:${albumId}`);
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
        await this._cacheService.delete(`albumLikeUser:${albumId}`);
    }

    async getAlbumLikeUser(userId, albumId){
        try {
        const result = await this._cacheService.get(`albumLikeUser:${albumId}`);
        console.log(`testing cache ${JSON.parse(result)}`);
        return JSON.parse(result);
        } catch (error) {
            console.log(`get album call database`);
            const query = {
                text:'SELECT * FROM user_album_like WHERE user_id = $1 AND album_id = $2',
                values: [userId, albumId],
            };
            const result = await this._Pool.query(query);
      
            if (!result.rowCount) {
            throw new NotFoundError(`Album tidak ditemukan.`);
            }
            await this._cacheService.set(`albumLikeUser:${albumId}`, result.rowCount);
            return result.rowCount
        }
       
    }
}

module.exports = AlbumLikeUserService