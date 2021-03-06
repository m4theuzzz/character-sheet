const Database = require('./Database');

const TABLE_NAME = 'spells';

class Spell {
    constructor(id, newSpellInfo = null) {
        const db = new Database('db');
        let spellInfo = {};
        if (newSpellInfo == null) {
            let filter = { "id": id };
            db.fetchRowsWithFilter(TABLE_NAME, filter, spell => {
                return spellInfo = spell[0];
            });
        } else {
            spellInfo = newSpellInfo;
        }

        this.spellId = spellInfo.spellId ?? 0;
        this.name = spellInfo.name ?? "";
        this.school = spellInfo.school ?? "";
        this.level = spellInfo.level ?? 0;
        this.classes = spellInfo.classes ?? "";
        this.casting = spellInfo.casting ?? { "time": 1, "type": "ação", "ritual": false };
        this.range = spellInfo.range ?? { "type": "ranged", "distance": 9 };
        this.damages = spellInfo.damages ?? []; //{ "numberOfDices": 1, "diceType": "d6", "damageType": "fogo" }
        this.conditions = spellInfo.conditions ?? []; //{ "name": "", "duration": "" }
        this.duration = spellInfo.duration ?? "";
        this.components = spellInfo.components ?? { "verbal": false, "somatic": false, "material": "" };
        this.description = spellInfo.description ?? "";
        this.origin = spellInfo.origin ?? "Player's Handbook";

        if (newSpellInfo != null) {
            this.insertNewSpellInDatabase();
        }
    }

    insertNewSpellInDatabase() {
        const db = new Database('db');
        let spell = { ...this };

        spell.spellId = db.getNextRowId(TABLE_NAME) ?? 1;

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
        const db = new Database('db');
        let spell = { ...this };
        let changeMap = {
            "where": { "id": this.id },
            "set": spell
        };
        db.updateRowInTable(TABLE_NAME, changeMap);
    }
}

module.exports = Spell;