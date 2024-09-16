const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");

class AlbumService {
  constructor() {
    this._Pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = nanoid(16);
    const albumId = `album-${id}`;

    const query = {
      text: "INSERT INTO album VALUES ($1,$2,$3) RETURNING id",
      values: [albumId, name, year],
    };

    const result = await this._Pool.query(query);
    if (!result.rows[0].id) {
      throw InvariantError("Album gagal ditambahkan");
    }

    return result.rows[0].id;
  }
  async getAlbumById(id) {
    const query = {
      text: "SELECT * FROM album WHERE id = $1",
      values: [id],
    };

    const result = await this._Pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Album tidak ditemukan");
    }

    return result.rows[0];
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: "UPDATE album SET name = $1, year = $2 WHERE id = $3 RETURNING id",
      values: [name, year, id],
    };
    const result = await this._Pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui catatan. Id tidak ditemukan");
    }
  }
}

module.exports = AlbumService;
