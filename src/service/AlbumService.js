const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");

class AlbumService {
  constructor() {
    this._Pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = nanoid(16);

    const query = {
      text: "INSERT INTO album VALUES ($1,$2,$3) RETURNING id",
      values: [id, name, year],
    };

    const result = await this._Pool.query(query);
    if (!result.rows[0].id) {
      throw InvariantError("Album gagal ditambahkan");
    }
    return result.rows[0].id;
  }
}

module.exports = AlbumService;
