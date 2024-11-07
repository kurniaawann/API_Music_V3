const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const bcrypt = require('bcrypt');
const InvariantError = require('../exceptions/InvariantError');

class UserService {
    constructor(){
        this._Pool = new Pool();
    }

    async addUser ({username, password, fullname}){
        await this.verifyNewUsername(username);
        console.log('dijalankan');
        const id = `user-${nanoid()}`;
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = {
            text: 'INSERT INTO users (id, username, password,fullname) VALUES($1, $2, $3, $4) RETURNING id',
            values:[id, username, hashedPassword, fullname]
        }  
       
        const result = await this._Pool.query(query);
        if (!result.rows.length) {
            throw new InvariantError('User gagal ditambahkan');
        }
        return result.rows[0].id;
    }

    async verifyNewUsername(username){
        const query = {
            text: 'SELECT * FROM users WHERE username = $1',
            values:[username]
        }
        console.log(JSON.stringify(query));
        
        const result = await this._Pool.query(query);

        if (result.rowCount) {
            throw new InvariantError('Gagal menambahkan user. Username sudah digunakan')
        }
    }
}

module.exports = UserService