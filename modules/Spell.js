const Database = require('./Database');

const db = new Database('cb');

const TABLE_NAME = 'spells';

class Spell {
    constructor(spellId, newSpellInfo = null) {
        let spellInfo = {};
        if (newSpellInfo == null) {
            let filter = { "spellId": spellId };
            db.fetchRowsWithFilter(TABLE_NAME, filter, spell => {
                return spellInfo = spell[0];
            });
        } else {
            spellInfo = newSpellInfo;
        }

        this.spellId = spellInfo.spellId ?? 0;
        this.name = spellInfo.name ?? "";
        this.level = spellInfo.level ?? 0;
        this.classes = spellInfo.classes ?? [];
        this.casting = spellInfo.casting ?? { "time": 1, "type": "action", "ritual": false };
        this.range = spellInfo.range ?? { "type": "ranged", "distance": 9 };
        this.damage = spellInfo.damage ?? { "numberOfDices": 1, "diceType": "d6", "damageType": "fire" };
        this.duration = spellInfo.duration ?? { "type": "concentration", "value": 1, "count": "minute" };
        this.components = spellInfo.components ?? { "verbal": false, "somatic": false, "material": [] };
        this.description = spellInfo.description ?? "";
        this.origin = spellInfo.origin ?? "Player's Handbook";

        if (newSpellInfo != null) {
            insertNewSpellInDatabase();
        }
    }

    insertNewSpellInDatabase() {
        let spell = { ...this };

        spell.spellId = db.getNextRowId(TABLE_NAME);

        return db.insertIntoTable(TABLE_NAME, spell);
    }

    getAllSpellInfo() {
        return { ...this };
    }

    setName(name) {
        this.name = name;
    }

    setLevel(level) {
        this.name = name;
    }

    setClasses(classes) {
        this.classes = classes;
    }

    setCasting(casting) {
        this.casting = casting;
    }

    setRange(range) {
        this.range = range;
    }

    setDamage(damage) {
        this.damage = damage;
    }

    setDuration(duration) {
        this.duration = duration;
    }

    setComponents(components) {
        this.components = components;
    }

    setDescription(description) {
        this.description = description;
    }

    setOrigin(origin) {
        this.origin = origin;
    }

    saveSpellInDatabase() {
        let spell = { ...this };
        let changeMap = {
            "where": { "spellId": this.spellId },
            "set": spell
        };
        db.updateRowInTable(TABLE_NAME, changeMap);
    }
}

module.exports = Spell;