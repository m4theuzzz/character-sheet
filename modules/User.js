const Database = require('./Database');

const db = new Database('db', true);

const TABLE_NAME = "users"

class User {
    constructor(username, password) {
        this.info = {};

        const filter = { "name": username, "password": password };
        db.fetchRowsWithFilter(TABLE_NAME, filter, user => {
            return this.info = user[0];
        });

        if (!this.info || this.info == {}) {
            this.insertNewUser(username, password);
        }
    }

    getName = () => this.info?.name ?? null;

    getId = () => this.info?.id ?? null;

    validate = (pass) => this.info.password == pass;

    insertNewUser = (name, pass) => {
        db.insertIntoTable(TABLE_NAME, { "name": name, "password": pass });
    }
}

module.exports = User;
