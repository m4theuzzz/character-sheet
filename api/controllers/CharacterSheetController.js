'use strict';

const Database = require('../../modules/Database');
const Sheet = require('../../modules/Sheet');

const TABLE_NAME = 'characters';

exports.startCharacterSheet = (req, res) => {
    const userId = req.headers.user;
    process.env.USER_ID = userId;

    let sheet = new Sheet(parseInt(req.params.id));
    let response = { "character": sheet.getCharacterObject() };
    res.status(200).send(response);
}

exports.updateCharacterSheet = (req, res) => {
    const userId = req.headers.user;
    process.env.USER_ID = userId;

    const db = new Database('db');
    let changeMap = {
        "where": { "characterId": parseInt(req.body.character.characterId) },
        "set": req.body.character
    };
    let requestResponse = db.updateRowInTable(TABLE_NAME, changeMap);
    res.status(200).send(requestResponse);
}
