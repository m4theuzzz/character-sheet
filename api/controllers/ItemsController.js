'use strict';

const Database = require('../../modules/Database');
const Item = require('../../modules/Item');

const TABLE_NAME = 'items';

const RARITIES = ["unknown", "commom", "uncommon", "rare", "very rare", "legendary", "artifact"];
const ITEM_TYPES = ["item", "armor", "weapon"];

exports.getAllItemsList = (req, res) => {
    const userId = req.headers.user;
    process.env.USER_ID = userId;

    const db = new Database('db');
    let itemsList = [];

    db.fetchAllRowsFromTable(TABLE_NAME, items => {
        itemsList = items;
    });

    return res.status(200).send({ "items": itemsList });
};

exports.createNewItem = (req, res) => {
    const userId = req.headers.user;
    process.env.USER_ID = userId;

    const newItem = req.body.itemInfo;
    const item = new Item(0, newItem);
    return res.status(200).send({ "itemId": item.itemId });
};

exports.getItemsConstants = (req, res) => {
    const userId = req.headers.user;
    process.env.USER_ID = userId;

    const constants = {
        "rarities": RARITIES,
        "itemTypes": ITEM_TYPES
    };
    res.status(200).send(constants);
}

exports.getItemById = (req, res) => {
    const userId = req.headers.user;
    process.env.USER_ID = userId;

    const itemId = parseInt(req.params.id);
    const item = new Item(itemId);
    return res.status(200).send({ "item": item.getAllItemInformation() });
};

exports.updateItem = (req, res) => {
    const userId = req.headers.user;
    process.env.USER_ID = userId;

    const db = new Database('db');
    let item = req.body.itemInfo;

    let changeMap = {
        "where": { "itemId": item.itemId },
        "set": item
    };

    return res.status(200).send(db.updateRowInTable(TABLE_NAME, changeMap));
};

exports.deleteItem = (req, res) => {
    const userId = req.headers.user;
    process.env.USER_ID = userId;

    const db = new Database('db');
    let itemId = parseInt(req.params.id);
    let filter = { "itemId": itemId };

    return res.status(200).send(db.deleteRowInTable(TABLE_NAME, filter));
};