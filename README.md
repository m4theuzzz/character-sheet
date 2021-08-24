# API

Rotas suportadas pela API:

* GET /characters -> Busca todos os personagens, retornando somente o ID de personagem e o Nome

* POST /characters -> Cria um novo personagem
corpo (type: JSON):
{
    "name": {{characterName}}
}

* DELETE /characters/:id -> Apaga um personagem

* GET /characterSheet/:id -> busca todos os dados necessários para a construção da ficha do personagem

* PUT /characterSheet/:id -> atualiza o banco de dados do personagem com as informações do objeto
corpo (type: JSON): //somente o campo `characterId` obrigatório
{
    "character": {
        "characterId": 1,
        "name": "",
        "classes": [],
        "levels": [],
        "race": "",
        "background": "",
        "alignment": "",
        "playerName": "",
        "experiencePoints": "0",
        "inspirationPoints": "",
        "strength": "14",
        "dexterity": "13",
        "constitution": "15",
        "inteligence": "12",
        "wisdom": "10",
        "charisma": "8",
        "halfProficienciesArray": [
            "athletics",
            "deception"
        ],
        "proficienciesArray": [
            "insight",
            "intimidation"
        ],
        "doubleProficienciesArray": [
            "acrobatics",
            "performance"
        ],
        "armorClass": "",
        "initiative": "",
        "speedArray": [],
        "maximumHitPoints": "",
        "currentHitPoints": "",
        "temporaryHitPoints": "",
        "maximumHitDices": "",
        "currentHitDices": "",
        "deathSaves": {
            "successes": 0,
            "failures": 0
        },
        "actionsArray": [],
        "bonusActionsArray": [],
        "reactionsArray": [],
        "personalityTraitsArray": [],
        "idealsArray": [],
        "bondsArray": [],
        "flawsArray": [],
        "otherProficienciesArray": [],
        "equipmentArray": [],
        "featuresArray": [],
        "baseModifiers": {
            "strength": "+2",
            "dexterity": "+1",
            "constitution": "+2",
            "inteligence": "+1",
            "wisdom": "+0",
            "charisma": "-1"
        },
        "skillScores": {
            "strength": {
                "athletics": "+3"
            },
            "dexterity": {
                "acrobatics": "+5",
                "sleightOfHands": "+1",
                "stealth": "+1"
            },
            "inteligence": {
                "arcana": "+1",
                "history": "+1",
                "investigation": "+1",
                "nature": "+1",
                "religion": "+1"
            },
            "wisdom": {
                "animalHandling": "+0",
                "insight": "+2",
                "medicine": "+0",
                "perception": "+0",
                "survival": "+0"
            },
            "charisma": {
                "deception": "+0",
                "intimidation": "+1",
                "performance": "+3",
                "persuasion": "-1"
            }
        },
        "proficiencyBonus": "+2"
    }
}