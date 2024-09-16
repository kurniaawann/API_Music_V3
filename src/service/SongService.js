const { nanoid } = require("nanoid");
const { Pool } = require("pg");

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
}

module.exports = SongService;
