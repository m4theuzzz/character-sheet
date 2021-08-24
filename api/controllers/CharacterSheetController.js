'use strict';

const Database = require('../../modules/Database');
const Sheet = require('../../modules/Sheet');

const db = new Database('db');

const TABLE_NAME = 'characters';

exports.startCharacterSheet = (req, res) => {
    let sheet = new Sheet(parseInt(req.params.id));
    let response = { "character": sheet.getCharacterObject() };
    res.status(200).send(response);
}

exports.updateCharacterSheet = (req, res) => {
    let changeMap = {
        "where": { "characterId": parseInt(req.body.character.characterId) },
        "set": req.body.character
    };
    let requestResponse = db.updateRowInTable(TABLE_NAME, changeMap);
    res.status(200).send(requestResponse);
}
