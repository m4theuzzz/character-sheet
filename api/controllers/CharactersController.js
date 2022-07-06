'use strict';

const Database = require('../../modules/Database');
const Character = require('../../modules/Character');

const TABLE_NAME = 'characters';

exports.getCharactersList = (req, res) => {
    const userId = req.headers.user;
    process.env.USER_ID = userId;

    const db = new Database('db');
    let charactersList = [];

    db.fetchAllRowsFromTable(TABLE_NAME, data => {
        if (data.length < 1) {
            return res.status(200).send({ "characters": charactersList });
        }

        charactersList = data.reduce((acc, cur) => {
            acc.push({ "characterId": cur.characterId, "name": cur.name });
            return acc;
        }, []);
    });

    return res.status(200).send({ "characters": charactersList });
}

exports.createNewCharacter = (req, res) => {
    const userId = req.headers.user;
    process.env.USER_ID = userId;

    let characterName = req.body.name;
    const char = new Character(0, characterName, true);
    return res.status(200).send({ "response": "Personagem criado com sucesso." });
}

exports.deleteCharacter = (req, res) => {
    const userId = req.headers.user;
    process.env.USER_ID = userId;

    const db = new Database('db');
    let filter = { "characterId": parseInt(req.params.id) };
    return res.status(200).send(db.deleteRowInTable(TABLE_NAME, filter));
}
