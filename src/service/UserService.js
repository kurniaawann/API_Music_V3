const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const bcrypt = require('bcrypt');

class UserService {
    constructor(){
        this._Pool = new Pool();
    }

    async addUser ({username, password, fullname}){
        await this.verifyNewUsername(username);
        const id = `user-${nanoid()}`;
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = {
            text: 'INSERT INTO users (id, username, password,fullname) VALUES($1, $2, $3, $4) RETURNING id',
            values:[id, username, password, fullname]
        }
    }

    async verifyNewUsername(username){
        const query = {
            text: 'SELECT * FROM users WHERE username = $1',
            values:[username]
        }
        
        const result = this._Pool.query(query);

        if (result.rows.length > 0) {
            throw new InvariantError('Gagal menambahkan user. Username sudah digunakan')
        }
    }
}

module.exports = UserService