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
    let spellsList = [];

    db.fetchAllRowsFromTable(TABLE_NAME, spells => {
        if (spells.length == 0) {
            return res.status(200).send({ "spells": spellsList });
        }

        spellsList = spells.reduce((acc, cur) => {
            acc.push({ "spellId": cur.spellId, "name": cur.name });
            return acc;
        }, []);
    });

    return res.status(200).send({ "spells": spellsList });
};

exports.createNewSpell = (req, res) => {
    let newSpell = req.body.spellInfo;
    const spell = new Spell(0, newSpell);
    return res.status(200).send({ "response": "Magia criada com sucesso." });
};

exports.getCastingTypes = (req, res) => {
    return res.status(200).send({ "castingTypes": CASTING_TYPES });
};

exports.getDurationTypes = (req, res) => {
    return res.status(200).send({ "durationTypes": DURATION_TYPES });
};

exports.getDurationTimeCount = (req, res) => {
    return res.status(200).send({ "durationTimeCount": DURATION_TIME_COUNT });
};

exports.getRangeTypes = (req, res) => {
    return res.status(200).send({ "rangeTypes": RANGE_TYPES });
};

exports.getSpellById = (req, res) => {
    let spellId = parseInt(req.params.id);
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