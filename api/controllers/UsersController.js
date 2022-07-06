'use strict';

const Database = require('../../modules/Database');
const User = require('../../modules/User');

const db = new Database('db', true);

const TABLE_NAME = 'users';

exports.getUser = (req, res) => {
    const userName = req.headers.name;
    const userPass = req.headers.pass;

    const user = new User(userName, userPass);

    if (!user.getId()) {
        const validUser = new User(userName, userPass);
        process.env.USER_ID = validUser.getId();
        return res.status(200).send({ "user": { "name": validUser.getName(), "id": validUser.getId() } });
    }

    process.env.USER_ID = user.getId();
    return res.status(200).send({ "user": { "name": user.getName(), "id": user.getId() } });
}

exports.logOut = (req, res) => {
    process.env.USER_ID = 0;
    return res.status(200).send();
}