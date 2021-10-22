const API_URL = "http://127.0.0.1:37456";

const DURATION = 300;

const app = new Vue({
    el: '#app',
    data: {
        showHomePage: true,
        showCharacterSheet: false,
        showHabilityScores: { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false },
        showSpellSheet: false,
        showDetailsSheet: false,
        showDiary: false,
        charactersList: [],
        selectedCharacter: {},
        modal: "",
        itemsRarities: ["unknown", "commom", "uncommon", "rare", "very rare", "legendary", "artifact"],
        itemsTypes: ["item", "armor", "weapon"],
        allSavedSpells: [],
        editSpell: {},
        allSavedItems: [],
        editItem: {},
        editArrayIndex: -1
    },
    computed: {
        proficiencyBonus: {
            get: () => {
                const levelsArray = app.selectedCharacter.classes;

                let maximumLevel = 1;
                for (let i = 0; i < levelsArray.length; i++) {
                    maximumLevel = levelsArray[i].value > maximumLevel ? levelsArray[i].value : maximumLevel;
                }

                return `+${Math.ceil(maximumLevel / 4) + 1}`;
            }
        },
        passiveWisdom: {
            get: () => {
                return parseInt(app.selectedCharacter.skillScores.wisdom.perception.modifier) + 10;
            }
        },
        failuresStyle: {
            get: () => {
                return {
                    "width": `${app.selectedCharacter.deathSaves.failures * 34}%`
                };
            }
        },
        successesStyle: {
            get: () => {
                return {
                    "width": `${app.selectedCharacter.deathSaves.successes * 34}%`
                };
            }
        }
    },
    watch: {
        selectedCharacter: {
            handler: (updatedCharacter) => {
                let myHeader = {
                    "content-type": "application/json"
                };

                let myBody = JSON.stringify({
                    "character": updatedCharacter
                });

                Object.keys(updatedCharacter.baseModifiers).forEach(habilityScore => {
                    recalculateHabilityScoreModifier(habilityScore, updatedCharacter[habilityScore]);
                });

                for (let i = 0; i < updatedCharacter.classes.length; i++) {
                    validateClassesExistence(updatedCharacter.classes[i], i);
                }

                for (let i = 0; i < updatedCharacter.equipmentArray.length; i++) {
                    validateEquipmentExistence(updatedCharacter.equipmentArray[i], i);
                }

                fetch(`${API_URL}/characterSheet/${updatedCharacter.characterId}`, {
                    method: "PUT",
                    headers: myHeader,
                    body: myBody
                }).then(res => {
                    if (res.status == 200) {
                        dispatchHabilityScoresAnimation();
                        return console.log(`O personagem: ${updatedCharacter.name} foi atualizado`);
                    }
                }).catch(err => {
                    throw err;
                });
            },
            deep: true
        }
    },
    methods: {
        loadCharacterSheet: (id) => {
            fetch(`${API_URL}/characterSheet/${id}`).then(res => {
                if (res.status == 200) {
                    return res.json();
                }
            }).then(json => {
                updateSelectedCharacter(json["character"]);
                goToCharacterSheet();
            }).catch(err => {
                throw err;
            });
        },
        handleModalExhibition: (type, build = true, item = null, arrayIndex = -1) => {
            var myModal = new bootstrap.Modal(document.getElementById('modal'));
            myModal.hide();
            app.modal = type;
            build && myModal.show();
            if (item != null) {
                app.editItem = item;
            }
            if (arrayIndex > -1) {
                app.editArrayIndex = arrayIndex;
            }
        },
        deleteCharacter: (id) => {
            fetch(`${API_URL}/characters/${id}`, {
                method: 'DELETE'
            }).then(res => {
                updateCharacterList();
            }).catch(err => {
                throw err;
            });
        },
        addNewItem: () => {
            const itemObject = {
                "name": document.getElementById('newItemName').value,
                "type": document.getElementById('newItemType').value,
                "rarity": document.getElementById('newItemRarity').value,
                "weight": document.getElementById('newItemWeight').value,
                "value": document.getElementById('newItemValue').value,
                "description": document.getElementById('newItemDescription').value,
                "quantity": 1
            };

            const reqHeader = { "content-type": "application/json" };
            const reqBody = JSON.stringify({ "itemInfo": itemObject });

            fetch(`${API_URL}/items`, {
                method: "POST",
                headers: reqHeader,
                body: reqBody
            }).then(res => {
                return res.status == 200 ? res.json() : {};
            }).then(json => {
                app.selectedCharacter.equipmentArray.push({ ...json, ...itemObject });
                updateAllSavedItems();
                app.modal = 'Equipamentos';
            }).catch(err => {
                throw err;
            });
        },
        addItemToCharacter: (itemObject) => {
            const characterItems = app.selectedCharacter.equipmentArray;
            let canPush = true;
            let index = -1;

            for (let i = 0; i < characterItems.length; i++) {
                canPush = characterItems[i].itemId != itemObject.itemId;

                if (!canPush) {
                    index = i;
                    break;
                }
            }

            canPush ?
                app.selectedCharacter.equipmentArray.push(itemObject) :
                app.selectedCharacter.equipmentArray[index]["quantity"] += 1;

            app.modal = 'Equipamentos';
        },
        updateItem: (itemObject) => {
            const reqHeader = { "content-type": "application/json" };
            const reqBody = JSON.stringify({ "itemInfo": itemObject });

            fetch(`${API_URL}/items/`, {
                method: "PUT",
                headers: reqHeader,
                body: reqBody
            });

            app.modal = 'Adicionar Equipamento';
        },
        deleteItemFromDatabase: (itemId) => {
            fetch(`${API_URL}/items/${itemId}`, {
                method: "DELETE"
            });
            updateAllSavedItems();
        },
        updateProficiencyArrays: (skill, hability) => {
            alternateSkillProficiencyType(skill, hability);
        },
        deleteMovement(index) {
            app.selectedCharacter.speedArray.splice(index, 1);
        },
        deleteTrait(index) {
            app.selectedCharacter.personalityTraitsArray.splice(index, 1);
        },
        deleteIdeal(index) {
            app.selectedCharacter.idealsArray.splice(index, 1);
        },
        deleteBond(index) {
            app.selectedCharacter.bondsArray.splice(index, 1);
        },
        deleteFlaw(index) {
            app.selectedCharacter.flawsArray.splice(index, 1);
        },
        deleteFeat: (index) => {
            app.selectedCharacter.featuresArray.splice(index, 1);
        },
        deleteAction: (index, type) => {
            app.selectedCharacter.actions[type].splice(index, 1);
        },
        translate: (skill) => {
            let translation = "";

            skill == "athletics" ? translation = "Atletismo" : "";
            skill == "acrobatics" ? translation = "Acrobacias" : "";
            skill == "sleightOfHands" ? translation = "Prestidigitação" : "";
            skill == "stealth" ? translation = "Furtividade" : "";
            skill == "arcana" ? translation = "Arcanismo" : "";
            skill == "history" ? translation = "História" : "";
            skill == "investigation" ? translation = "Investigação" : "";
            skill == "nature" ? translation = "Natureza" : "";
            skill == "religion" ? translation = "Religião" : "";
            skill == "animalHandling" ? translation = "Adestramento" : "";
            skill == "insight" ? translation = "Intuição" : "";
            skill == "medicine" ? translation = "Medicina" : "";
            skill == "perception" ? translation = "Percepção" : "";
            skill == "survival" ? translation = "Sobrevivência" : "";
            skill == "deception" ? translation = "Enganação" : "";
            skill == "intimidation" ? translation = "Intimidação" : "";
            skill == "performance" ? translation = "Interpretação" : "";
            skill == "persuasion" ? translation = "Persuasão" : "";

            return translation;
        },
        otherTranslations: (string) => {
            let translation = "";

            string == "unknown" ? translation = "Desconhecida" : "";
            string == "commom" ? translation = "Comum" : "";
            string == "uncommon" ? translation = "Incomum" : "";
            string == "rare" ? translation = "Raro" : "";
            string == "very rare" ? translation = "Muito Raro" : "";
            string == "legendary" ? translation = "Lendário" : "";
            string == "artifact" ? translation = "Artefato" : "";
            string == "item" ? translation = "Item" : "";
            string == "armor" ? translation = "Armadura" : "";
            string == "weapon" ? translation = "Arma" : "";

            return translation;
        }
    }
});

$(document).ready(function () {
    $("body").tooltip({
        selector: '[data-bs-toggle=tooltip]'
    });
});