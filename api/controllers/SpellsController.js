'use strict';

const Database = require('../../modules/Database');
const Spell = require('../../modules/Spell');

const db = new Database('db');

const TABLE_NAME = 'spells';
const CASTING_TYPES = ["action", "bonus action", "hour", "minute", "reaction", "no action"];
const DURATION_TYPES = ["concentration", "instantaneous", "special", "time", "until dispelled", "until dispelled or triggered"];
const DURATION_TIME_COUNT = ["round", "minute", "hour", "day"];
const RANGE_TYPES = ["self", "touch", "ranged", "sight", "unlimited"];

exports.getAllSpellList = (req, res) => {
    db.fetchAllRowsFromTable(TABLE_NAME, spells => {
        return res.status(200).send({ "spells": spells });
    });
};

exports.createNewSpell = (req, res) => {
    const newSpell = req.body.spellInfo;
    const spell = new Spell(0, newSpell);
    return res.status(200).send({ "spellId": spell.spellId });
};

exports.getConstants = (req, res) => {
    const constants = {
        "castingTypes": CASTING_TYPES,
        "durationTypes": DURATION_TYPES,
        "durationTimeCount": DURATION_TIME_COUNT,
        "rangeTypes": RANGE_TYPES
    };
    return res.status(200).send(constants);
};

exports.getSpellById = (req, res) => {
    let spell;
    const spellId = parseInt(req.params.id);
    const filter = { "spellId": spellId };

    db.fetchRowsWithFilter(TABLE_NAME, filter, spells => {
        spell = spells[0];
    });

    return res.status(200).send({ "spell": spell });
};

exports.updateSpell = (req, res) => {
    let spell = req.body.spellInfo;

    let changeMap = {
        "where": { "spellId": spell.spellId },
        "set": spell
    };

    return res.status(200).send(db.updateRowInTable(TABLE_NAME, changeMap));
};

exports.deleteSpell = (req, res) => {
    let spellId = parseInt(req.params.id);
    let filter = { "spellId": spellId };

    return res.status(200).send(db.deleteRowInTable(TABLE_NAME, filter));
};