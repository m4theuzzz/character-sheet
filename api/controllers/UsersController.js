'use strict';

const Database = require('../../modules/Database');
const User = require('../../modules/User');

const db = new Database('db');

const TABLE_NAME = 'users';

exports.getUser = (req, res) => {
    const userName = req.headers.name;
    const userPass = req.headers.pass;

    console.log(userName, userPass)

    const user = new User(userName, userPass);

    if (!user.getId()) {
        const validUser = new User(userName, userPass);
        return res.status(200).send({ "user": { "name": validUser.getName(), "id": validUser.getId() } });
    }

    return res.status(200).send({ "user": { "name": user.getName(), "id": user.getId() } });
}