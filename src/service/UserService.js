const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const bcrypt = require('bcrypt');
const InvariantError = require('../exceptions/InvariantError');
const AuthenticationError = require("../exceptions/AuthenticationError");

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

    async verifyUserCredential(username, password){
        const query = {
            text:'SELECT id, password FROM users WHERE username = $1',
            values:[username]
        }

        const result  = await this._Pool.query(query)

        console.log(`ini adalah ${result.rows.length}`);

        if (!result.rows.length) {
            throw new AuthenticationError('Username atau password salah')
        }
        console.log('Result:', result.rows[0]);
        const {id, password:hashedPassword} = result.rows[0];
        const match  = await bcrypt.compare(password, hashedPassword)

        console.log(`ini adalah match ${match}`);

        if (!match) {
            throw new AuthenticationError('Username ')
        }
        console.log(id);
        return id
    }
}

module.exports = UserService