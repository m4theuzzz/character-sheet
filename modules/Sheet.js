const Character = require('./Character');

const BASE_HABILITY_SCORES = ["strength", "dexterity", "constitution", "inteligence", "wisdom", "charisma"];
const SKILLS = {
    "strength": ["athletics"],
    "dexterity": ["acrobatics", "sleightOfHands", "stealth"],
    "constitution": [],
    "inteligence": ["arcana", "history", "investigation", "nature", "religion"],
    "wisdom": ["animalHandling", "insight", "medicine", "perception", "survival"],
    "charisma": ["deception", "intimidation", "performance", "persuasion"],
};

let baseModifiers = {};
let proficiencyBonus = "+2";

class Sheet {
    constructor(characterId) {
        this.characterEntity = new Character(characterId);
        this.characterObject = this.characterEntity.getAllCharacterInfo();
        this.completeCharacterObject();
    }

    completeCharacterObject() {
        baseModifiers = this.calculateModifiers();
        proficiencyBonus = this.calculateProficiencyBonus();
        let skillsScores = this.calculateSkillModifiersWithProficiency();

        this.characterObject = {
            ...this.characterObject,
            "baseModifiers": baseModifiers,
            "skillScores": skillsScores,
            "proficiencyBonus": proficiencyBonus
        };
    }

    calculateModifiers() {
        return BASE_HABILITY_SCORES.reduce((acc, cur) => {
            let modifier = Math.trunc(parseInt(this.characterObject[cur]) / 2) - 5;
            acc[cur] = modifier >= 0 ? `+${modifier}` : `${modifier}`;
            return acc;
        }, {});
    }

    calculateProficiencyBonus() {
        let levelsArray = this.characterObject.levels;

        if (levelsArray.length == 0) {
            return "+2";
        }

        let totalLevel = 0;
        for (let i = 0; i < levelsArray.length; i++) {
            totalLevel += levelsArray[i].level;
        }
        return `+${Math.ceil(totalLevel / 4) + 1}`;
    }

    calculateSkillModifiersWithProficiency() {
        let halfSkills = this.characterObject.halfProficienciesArray;
        let fullSkills = this.characterObject.proficienciesArray;
        let doubleSkills = this.characterObject.doubleProficienciesArray;
        return BASE_HABILITY_SCORES.reduce((acc, cur) => {
            if (SKILLS[cur].length == 0) {
                return acc;
            }

            if (!acc[cur]) {
                acc[cur] = {};
            }

            for (let i = 0; i < SKILLS[cur].length; i++) {
                acc[cur][SKILLS[cur][i]] = {
                    "name": SKILLS[cur][i],
                    "modifier": baseModifiers[cur],
                    "proficiency": "none"
                };

                if (halfSkills.indexOf(SKILLS[cur][i]) != -1) {
                    acc[cur][SKILLS[cur][i]]["proficiency"] = "half";
                    continue;
                }

                if (fullSkills.indexOf(SKILLS[cur][i]) != -1) {
                    acc[cur][SKILLS[cur][i]]["proficiency"] = "full";
                    continue;
                }

                if (doubleSkills.indexOf(SKILLS[cur][i]) != -1) {
                    acc[cur][SKILLS[cur][i]]["proficiency"] = "double";
                    continue;
                }
            }

            return acc;
        }, {});
    }

    getCharacterObject() {
        return this.characterObject;
    }

    getCharacterEntity() {
        return this.characterEntity;
    }
}

module.exports = Sheet;