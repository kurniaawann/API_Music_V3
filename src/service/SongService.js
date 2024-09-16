const { Pool } = require("pg");

class SongService {
  constructor() {
    this._Pool = new Pool();
  }

  async addSong() {}
}

module.exports = SongService;
