const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const mapDBToModel = require("../utils/MapDBToModel");

class SongService {
  constructor() {
    this._Pool = new Pool();
  }

  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = nanoid(16);
    const songId = `song-${id}`;
    const query = {
      text: "INSERT INTO song VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id",
      values: [songId, title, year, genre, performer, duration, albumId],
    };
    const result = await this._Pool.query(query);
    if (!result.rows[0].id) {
      throw InvariantError("Song gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getAllSongs() {
    const result = await this._Pool.query("SELECT * FROM song");
    return result.rows.map((row) => {
      return {
        id: row.id,
        title: row.title,
        performer: row.performer,
      };
    });
  }

  async getSongsById(id) {
    const query = {
      text: "SELECT * FROM song WHERE id = $1",
      values: [id],
    };
    const result = await this._Pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Song tidak ditemukan");
    }

    return result.rows.map(mapDBToModel)[0];
  }

  async editSongById(id, { title, year, genre, performer, duration, albumId }) {
    const query = {
      text: "UPDATE song SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id",
      values: [title, year, genre, performer, duration, albumId, id],
    };
    const result = await this._Pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui song. Id tidak ditemukan");
    }
  }
}

module.exports = SongService;
