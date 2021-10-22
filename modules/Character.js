const Database = require('./Database');
const db = new Database('db');

const TABLE_NAME = 'characters';

class Character {
    constructor(characterId = 0, characterName = "", createNewCharacter = false) {
        let characterInfo = {};

        if (!createNewCharacter) {
            let filter = { "characterId": characterId };
            db.fetchRowsWithFilter(TABLE_NAME, filter, characters => {
                if (characters.length == 0) {
                    throw "Personagem não encontrado";
                }
                return characterInfo = characters[0];
            });
        }

        //cabeçalho
        this.characterId = characterInfo.characterId ?? 0;
        this.name = characterInfo.name ?? characterName;
        this.classes = characterInfo.classes ?? [];
        this.levels = characterInfo.levels ?? [];
        this.race = characterInfo.race ?? "";
        this.background = characterInfo.background ?? "";
        this.alignment = characterInfo.alignment ?? "";
        this.playerName = characterInfo.playerName ?? "";
        this.experiencePoints = characterInfo.experiencePoints ?? "0";

        //pontuações
        this.inspirationPoints = characterInfo.inspirationPoints ?? "";
        this.strength = characterInfo.strength ?? "10";
        this.dexterity = characterInfo.dexterity ?? "10";
        this.constitution = characterInfo.constitution ?? "10";
        this.inteligence = characterInfo.inteligence ?? "10";
        this.wisdom = characterInfo.wisdom ?? "10";
        this.charisma = characterInfo.charisma ?? "10";
        this.halfProficienciesArray = characterInfo.halfProficienciesArray ?? [];
        this.proficienciesArray = characterInfo.proficienciesArray ?? [];
        this.doubleProficienciesArray = characterInfo.doubleProficienciesArray ?? [];

        //combate
        this.armorClass = characterInfo.armorClass ?? "";
        this.initiative = characterInfo.initiative ?? "";
        this.speedArray = characterInfo.speedArray ?? [];
        this.hitPoints = characterInfo.hitPoints ?? { "maximum": 0, "current": 0, "temporary": 0 };
        this.hitDices = characterInfo.hitDices ?? { "type": "d8", "current": 1 };
        this.deathSaves = characterInfo.deathSaves ?? { "successes": 0, "failures": 0 };
        this.actions = characterInfo.actions ?? { "main": [], "bonus": [], "reactions": [] };
        this.spellCasting = characterInfo.spellCasting ?? { "hit": "+0", "difficultyClass": "0", "spellSlots": { "0": { "total": 0, "actual": 0 }, "1": { "total": 0, "actual": 0 }, "2": { "total": 0, "actual": 0 }, "3": { "total": 0, "actual": 0 }, "4": { "total": 0, "actual": 0 }, "5": { "total": 0, "actual": 0 }, "6": { "total": 0, "actual": 0 }, "7": { "total": 0, "actual": 0 }, "8": { "total": 0, "actual": 0 }, "9": { "total": 0, "actual": 0 } }, "spellsList": [] };

        //personalidade
        this.personalityTraitsArray = characterInfo.personalityTraitsArray ?? [];
        this.idealsArray = characterInfo.idealsArray ?? [];
        this.bondsArray = characterInfo.bondsArray ?? [];
        this.flawsArray = characterInfo.flawsArray ?? [];

        //personagem
        this.otherProficiencies = characterInfo.otherProficiencies ?? { "armors": "", "weapons": "", "languages": "", "tools": "" };
        this.equipmentArray = characterInfo.equipmentArray ?? [];
        this.currency = characterInfo.currency ?? { "copper": 0, "silver": 0, "gold": 0, "platin": 0 };
        this.featuresArray = characterInfo.featuresArray ?? [];
        this.diary = characterInfo.diary ?? "";

        if (createNewCharacter) {
            this.insertNewCharacterOnTable();
        }

        return this;
    }

    insertNewCharacterOnTable() {
        let character = { ...this };

        character.characterId = db.getNextRowId(TABLE_NAME);

        return db.insertIntoTable(TABLE_NAME, character);
    }

    getAllCharacterInfo() {
        return { ...this };
    }

    setName(name) {
        this.name = name;
    }

    setClasses(classes) {
        this.classes = classes;
    }

    setLevels(levels) {
        this.levels = levels;
    }

    setRace(race) {
        this.race = race;
    }

    setBackground(background) {
        this.background = background;
    }

    setAlignment(alignment) {
        this.alignment = alignment;
    }

    setPlayerName(playerName) {
        this.playerName = playerName;
    }

    setExperiencePoints(experiencePoints) {
        this.experiencePoints = experiencePoints;
    }

    setInspirationPoints(inspirationPoints) {
        this.inspirationPoints = inspirationPoints;
    }

    setStrength(strength) {
        this.strength = strength;
    }

    setDexterity(dexterity) {
        this.dexterity = dexterity;
    }

    setConstitution(constitution) {
        this.constitution = constitution;
    }

    setInteligence(inteligence) {
        this.inteligence = inteligence;
    }

    setWisdom(wisdom) {
        this.wisdom = wisdom;
    }

    setCharisma(charisma) {
        this.charisma = charisma;
    }

    setProficienciesArray(proficienciesArray) {
        this.proficienciesArray = proficienciesArray;
    }

    setPersonalityTraitsArray(personalityTraitsArray) {
        this.personalityTraitsArray = personalityTraitsArray;
    }

    setIdealsArray(idealsArray) {
        this.idealsArray = idealsArray;
    }

    setBondsArray(bondsArray) {
        this.bondsArray = bondsArray;
    }

    setFlawsArray(flawsArray) {
        this.flawsArray = flawsArray;
    }

    setOtherProficienciesArray(otherProficienciesArray) {
        this.otherProficienciesArray = otherProficienciesArray;
    }

    setEquipmentArray(equipmentArray) {
        this.equipmentArray = equipmentArray;
    }

    setfeaturesArray(featuresArray) {
        this.featuresArray = featuresArray;
    }

    saveCharacterInDatabase() {
        let character = { ...this };
        let changeMap = {
            "where": { "characterId": this.characterId },
            "set": character
        };
        db.updateRowInTable(TABLE_NAME, changeMap);
    }
}

module.exports = Character;