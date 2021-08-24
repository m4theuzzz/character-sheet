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
            const modifier = Math.trunc(parseInt(this.characterObject[cur]) / 2) - 5;
            acc[cur] = modifier >= 0 ? `+${modifier}` : `${modifier}`;
            return acc;
        }, {});
    }

    calculateProficiencyBonus() {
        const levelsArray = this.characterObject.levels;

        let maximumLevel = 0;
        for (let i = 0; i < levelsArray.length; i++) {
            maximumLevel = levelsArray[i].level > maximumLevel ? levelsArray[i].level : maximumLevel;
        }
        return proficiencyBonus = `+${Math.ceil(maximumLevel / 4) + 1}`;
    }

    calculateSkillModifiersWithProficiency() {
        const halfSkills = this.characterObject.halfProficienciesArray;
        const fullSkills = this.characterObject.proficienciesArray;
        const doubleSkills = this.characterObject.doubleProficienciesArray;
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