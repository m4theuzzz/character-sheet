const Character = require('../modules/Character');
const Database = require('../modules/Database');

const db = new Database('db');
const char = new Character(0, "characterTest", true);

describe('Character tests', () => {
    test('Test get character info', () => {
        let info = char.getAllCharacterInfo();
        expect(Object.keys(info).length).toBe(38);
    });

    test('set name', () => {
        char.setName("name setted");
        expect(char.name).toBe("name setted");
    });

    test('set classes', () => {
        char.setClasses(["druida", "mago"]);
        expect(char.classes[0]).toBe("druida");
        expect(char.classes[1]).toBe("mago");
    });

    test('set levels', () => {
        char.setLevels({ "druida": 2, "mago": 3 });
        expect(char.levels["druida"]).toBe(2);
        expect(char.levels["mago"]).toBe(3);
    });

    test('set race', () => {
        char.setRace("Elfo");
        expect(char.race).toBe("Elfo");
    });

    test('apply changes to database', () => {
        let characterId = 0;
        db.fetchAllRowsFromTable('characters', characters => {
            characterId = characters[characters.length - 1].characterId;
        });
        char.characterId = characterId;
        char.saveCharacterInDatabase();

        const newCharacter = new Character(characterId);

        expect(newCharacter.name).toBe("name setted");
        expect(newCharacter.classes[0]).toBe("druida");
        expect(newCharacter.classes[1]).toBe("mago");
        expect(newCharacter.levels["druida"]).toBe(2);
        expect(newCharacter.levels["mago"]).toBe(3);
        expect(newCharacter.race).toBe("Elfo");
    });

    test('delete character', () => {
        let filter = { "characterId": char.characterId };
        db.deleteRowInTable('characters', filter);

        let testId = 0;
        db.fetchAllRowsFromTable('characters', characters => {
            testId = characters[characters.length - 1].characterId;
        });

        expect(testId).not.toBe(char.characterId);
    });
});