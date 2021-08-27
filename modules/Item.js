const Database = require('./Database');

const db = new Database('db');

const TABLE_NAME = "items";

class Items {
    constructor(itemId, newItemInfo = null) {
        let itemInfo = {};

        if (newItemInfo == null) {
            let filter = { "itemId": itemId };
            db.fetchRowsWithFilter(TABLE_NAME, filter, item => {
                return itemInfo = item[0];
            });
        } else {
            itemInfo = newItemInfo;
        }

        this.itemId = itemInfo.id ?? 0;
        this.name = itemInfo.name ?? "";
        this.type = itemInfo.type ?? "item";
        this.rarity = itemInfo.rarity ?? "unknown";
        this.weight = itemInfo.weight ?? "0";
        this.value = itemInfo.value ?? "0";
        this.description = itemInfo.description ?? "";

        if (newItemInfo != null) {
            this.insertNewItemInDatabase();
        }
    }

    insertNewItemInDatabase() {
        this.itemId = db.getNextRowId(TABLE_NAME);
        this.quantity = 1;

        let item = { ...this };

        return db.insertIntoTable(TABLE_NAME, item);
    }

    getAllItemInformation() {
        return { ...this };
    }

    setName(name) {
        this.name = name;
    }

    setType(type) {
        this.type = type;
    }

    setRarity(rarity) {
        this.rarity = rarity;
    }

    setWeight(weight) {
        this.weight = weight;
    }

    setValue(value) {
        this.value = value;
    }

    setDescription(description) {
        this.description = description;
    }

    saveItemInDatabase() {
        let item = { ...this };
        let changeMap = {
            "where": { "itemId": this.itemId },
            "set": item
        };
        db.updateRowInTable(TABLE_NAME, changeMap);
    }
}

module.exports = Items;