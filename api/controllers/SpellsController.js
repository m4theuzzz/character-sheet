'use strict';

const Database = require('../../modules/Database');
const Spell = require('../../modules/Spell');

const TABLE_NAME = 'spells';
const CASTING_TYPES = ["action", "bonus action", "hour", "minute", "reaction", "no action"];
const DURATION_TYPES = ["concentration", "instantaneous", "special", "time", "until dispelled", "until dispelled or triggered"];
const DURATION_TIME_COUNT = ["round", "minute", "hour", "day"];
const RANGE_TYPES = ["self", "touch", "ranged", "sight", "unlimited"];

exports.getAllSpellList = (req, res) => {
    const userId = req.headers.user;
    process.env.USER_ID = userId;

    const db = new Database('db');
    db.fetchAllRowsFromTable(TABLE_NAME, spells => {
        return res.status(200).send({ "spells": spells });
    });
};

exports.createNewSpell = (req, res) => {
    const userId = req.headers.user;
    process.env.USER_ID = userId;

    const newSpell = req.body.spellInfo;
    const spell = new Spell(0, newSpell);
    return res.status(200).send({ "id": spell.id });
};

exports.getConstants = (req, res) => {
    const userId = req.headers.user;
    process.env.USER_ID = userId;

    const constants = {
        "castingTypes": CASTING_TYPES,
        "durationTypes": DURATION_TYPES,
        "durationTimeCount": DURATION_TIME_COUNT,
        "rangeTypes": RANGE_TYPES
    };
    return res.status(200).send(constants);
};

exports.getSpellById = (req, res) => {
    const userId = req.headers.user;
    process.env.USER_ID = userId;

    const db = new Database('db');
    let spell;
    const id = parseInt(req.params.id);
    const filter = { "id": id };

    db.fetchRowsWithFilter(TABLE_NAME, filter, spells => {
        spell = spells[0];
    });

    return res.status(200).send({ "spell": spell });
};

exports.updateSpell = (req, res) => {
    const userId = req.headers.user;
    process.env.USER_ID = userId;

    const db = new Database('db');
    let spell = req.body.spellInfo;

    let changeMap = {
        "where": { "id": spell.id },
        "set": spell
    };

    return res.status(200).send(db.updateRowInTable(TABLE_NAME, changeMap));
};

exports.deleteSpell = (req, res) => {
    const userId = req.headers.user;
    process.env.USER_ID = userId;

    const db = new Database('db');
    let id = parseInt(req.params.id);
    let filter = { "id": id };

    return res.status(200).send(db.deleteRowInTable(TABLE_NAME, filter));
};