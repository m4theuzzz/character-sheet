'use strict';

const Database = require('../../modules/Database');
const Item = require('../../modules/Item');

const db = new Database('db');

const TABLE_NAME = 'items';

const RARITIES = ["unknown", "commom", "uncommon", "rare", "very rare", "legendary", "artifact"];
const ITEM_TYPES = ["item", "armor", "weapon"];

exports.getAllItemsList = (req, res) => {
    let itemsList = [];

    db.fetchAllRowsFromTable(TABLE_NAME, items => {
        if (items.length == 0) {
            return res.status(200).send({ "items": itemsList });
        }

        itemsList = items.reduce((acc, cur) => {
            acc.push({ "itemId": cur.itemId, "name": cur.name });
            return acc;
        }, []);
    });

    return res.status(200).send({ "items": itemsList });
};

exports.createNewItem = (req, res) => {
    const newItem = req.body.itemInfo;
    const item = new Item(0, newItem);
    return res.status(200).send({ "response": "Item criado com sucesso." });
};

exports.getItemsConstants = (req, res) => {
    const constants = {
        "rarities": RARITIES,
        "itemTypes": ITEM_TYPES
    };
    res.status(200).send(constants);
}

exports.getItemById = (req, res) => {
    let item;
    const itemId = parseInt(req.params.id);
    const filter = { "itemId": itemId };

    db.fetchRowsWithFilter(TABLE_NAME, filter, items => {
        item = items[0]
    });

    return res.status(200).send({ "item": item });
};

exports.updateItem = (req, res) => {
    let item = req.body.itemInfo;

    let changeMap = {
        "where": { "itemId": item.itemId },
        "set": item
    };

    return res.status(200).send(db.updateRowInTable(TABLE_NAME, changeMap));
};

exports.deleteItem = (req, res) => {
    let itemId = parseInt(req.params.id);
    let filter = { "itemId": itemId };

    return res.status(200).send(db.deleteRowInTable(TABLE_NAME, filter));
};