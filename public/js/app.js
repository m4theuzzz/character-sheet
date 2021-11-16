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
        allSpells: [],
        spellFilter: "",
        selectedCharacter: {},
        modal: "",
        itemsRarities: ["unknown", "commom", "uncommon", "rare", "very rare", "legendary", "artifact"],
        itemsTypes: ["item", "armor", "weapon"],
        allSavedItems: [],
        editItem: {},
        editArrayIndex: -1,
        edittedSpell: {},
        newSpell: {
            range: "meelee",
            damages: [],
            conditions: []
        },
        selectedSpell: {}
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
        },
        gotSpellsLevel: {
            get: () => {
                return app.selectedCharacter.spellCasting.spellsList
                    .reduce((list, spell) => {
                        if (list.indexOf(spell.level) == -1) {
                            list.push(spell.level);
                        }

                        return list;
                    }, []).sort();
            }
        },
        filteredSpells: {
            get: () => {
                return app.allSpells.filter(spell => {
                    if (spell.name.toLowerCase().indexOf(app.spellFilter.toLowerCase()) > -1) {
                        return spell;
                    }
                });
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
            if (item != null) {
                app.editItem = app.edittedSpell = item;
            }
            if (arrayIndex > -1) {
                app.editArrayIndex = arrayIndex;
            }
            build && myModal.show();
        },
        showSpell: (spell) => {
            app.selectedSpell = spell;
            app.handleModalExhibition('Magia');
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
        addSpellToCharacter: (spellObject) => {
            const characterSpells = app.selectedCharacter.spellCasting.spellsList;
            let canPush = true;

            for (let i = 0; i < characterSpells.length; i++) {
                canPush = characterSpells[i].spellId != spellObject.spellId;

                if (!canPush) {
                    break;
                }
            }

            canPush ?
                app.selectedCharacter.spellCasting.spellsList.push(spellObject) :
                window.alert('Você já possui essa magia');
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
        removeCharacterSpell: (spellId) => {
            app.selectedCharacter.spellCasting.spellsList = app.selectedCharacter.spellCasting.spellsList.filter(spell => {
                if (spell.spellId != spellId) {
                    return spell;
                }
            });
        },
        deleteSpellFromDatabase: (spellId) => {
            fetch(`${API_URL}/spells/${spellId}`, {
                method: "DELETE"
            });
            removeCharacterSpell();
            updateSpellsList();
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
        getAllSpells: () => {
            fetch(`${API_URL}/spells`, {
                method: "GET"
            }).then(res => {
                if (res.status == 200) {
                    return res.json();
                }
            }).then(json => {
                app.allSpells = json;
            }).catch(err => {
                throw err;
            });
        },
        getSpellsByLevel: (spellLevel) => {
            return app.selectedCharacter.spellCasting.spellsList.filter((spell) => {
                if (spell.level == spellLevel) {
                    return spell;
                }
            });
        },
        getListedSpellTooltipText: (spell) => {
            let text = "";
            if (spell.damages.length > 0) {
                let plural = spell.damages.length == 1 ? false : true;
                text += `<p class="tooltipText">Dano${plural ? "s" : ""}: `;
                spell.damages.forEach((damage, index) => {
                    text += `${damage.numberOfDices}${damage.diceType}[${app.translateSpell(damage.damageType)}]${!plural || spell.damages.length == index + 1 ? ";</p>" : ", "}`
                });
            }
            if (spell.conditions.length > 0) {
                let plural = spell.conditions.length == 1 ? false : true;
                text += `<p class="tooltipText">Condiç${plural ? "ões" : "ão"}: `;
                spell.conditions.forEach((condition, index) => {
                    text += `${condition.name}${!plural || spell.conditions.length == (index + 1) ? ";</p>" : ", "}`;
                });
            }
            return text;
        },
        saveSpellToDB: () => {
            const body = JSON.stringify({ spellInfo: app.edittedSpell });
            fetch(`${API_URL}/spells`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            }).then(() => {
                updateSpellsList()
                app.modal = 'Adicionar Magia';
            });
        },
        deleteMovement: (index) => {
            app.selectedCharacter.speedArray.splice(index, 1);
        },
        deleteTrait: (index) => {
            app.selectedCharacter.personalityTraitsArray.splice(index, 1);
        },
        deleteIdeal: (index) => {
            app.selectedCharacter.idealsArray.splice(index, 1);
        },
        deleteBond: (index) => {
            app.selectedCharacter.bondsArray.splice(index, 1);
        },
        deleteFlaw: (index) => {
            app.selectedCharacter.flawsArray.splice(index, 1);
        },
        deleteFeat: (index) => {
            app.selectedCharacter.featuresArray.splice(index, 1);
        },
        deleteAction: (index, type) => {
            app.selectedCharacter.actions[type].splice(index, 1);
        },
        listDamage: () => {
            const damagesTypes = app.newSpell.damages.filter(dmg => dmg.type);

            const newDamage = {
                id: new Date().getTime(),
                numberOfDices: document.getElementById("newDmgDiceNumber").value,
                diceType: document.getElementById("newDmgDiceType").value,
                damageType: document.getElementById("newDmgType").value
            };

            if (damagesTypes.indexOf(newDamage.damageType) > -1) {
                return window.alert("Você já possui danos deste tipo nesta magia");
            }

            app.newSpell.damages.push(newDamage);
        },
        removeDamage: (id) => {
            let i = 0;
            let toRemoveIndexes = app.newSpell.damages.reduce((indexes, damage) => {
                if (damage.id == id) {
                    indexes.push(i);
                }
                i++;
                return indexes;
            }, []).sort();

            for (let i = toRemoveIndexes.length - 1; i >= 0; i--) {
                app.newSpell.damages.splice(toRemoveIndexes[i], 1);
            }
        },

        removeDamageFromEdittedSpell: (id) => {
            let i = 0;
            let toRemoveIndexes = app.edittedSpell.damages.reduce((indexes, damage) => {
                if (damage.id == id) {
                    indexes.push(i);
                }
                i++;
                return indexes;
            }, []).sort();

            for (let i = toRemoveIndexes.length - 1; i >= 0; i--) {
                app.edittedSpell.damages.splice(toRemoveIndexes[i], 1);
            }
        },
        listDamageToEdittedSpell: () => {
            const damagesTypes = app.edittedSpell.damages.filter(dmg => dmg.type);

            const newDamage = {
                id: new Date().getTime(),
                numberOfDices: document.getElementById("newDmgDiceNumber").value,
                diceType: document.getElementById("newDmgDiceType").value,
                damageType: document.getElementById("newDmgType").value
            };

            if (damagesTypes.indexOf(newDamage.damageType) > -1) {
                return window.alert("Você já possui danos deste tipo nesta magia");
            }

            app.edittedSpell.damages.push(newDamage);
        },
        removeConditionFromEdittedSpell: (id) => {
            let i = 0;
            let toRemoveIndexes = app.edittedSpell.conditions.reduce((indexes, damage) => {
                if (damage.id == id) {
                    indexes.push(i);
                }
                i++;
                return indexes;
            }, []).sort();

            for (let i = toRemoveIndexes.length - 1; i >= 0; i--) {
                app.edittedSpell.conditions.splice(toRemoveIndexes[i], 1);
            }
        },
        listConditionToEdittedSpell: () => {
            const conditionNames = app.edittedSpell.conditions.filter(condition => condition.name);

            const newCondition = {
                id: new Date().getTime(),
                name: document.getElementById("newConditionName").value,
                duration: document.getElementById("newConditionDuration").value,
            };

            if (conditionNames.indexOf(newCondition.name) > -1) {
                return window.alert("Você já possui esta condição nesta magia");
            }

            app.edittedSpell.conditions.push(newCondition)
        },
        listCondition: () => {
            const conditionNames = app.newSpell.conditions.filter(condition => condition.name);

            const newCondition = {
                id: new Date().getTime(),
                name: document.getElementById("newConditionName").value,
                duration: document.getElementById("newConditionDuration").value,
            };

            if (conditionNames.indexOf(newCondition.name) > -1) {
                return window.alert("Você já possui esta condição nesta magia");
            }

            app.newSpell.conditions.push(newCondition)
        },
        removeCondition: (id) => {
            let i = 0;
            let toRemoveIndexes = app.newSpell.conditions.reduce((indexes, condition) => {
                if (condition.id == id) {
                    indexes.push(i);
                }
                i++;
                return indexes;
            }, []).sort();

            for (let i = toRemoveIndexes.length - 1; i >= 0; i--) {
                app.newSpell.conditions.splice(toRemoveIndexes[i], 1);
            }
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
        translateSpell: (string) => {
            let translation = "";

            string == "acid" ? translation = "Ácido" : "";
            string == "lightning" ? translation = "Elétrico" : "";
            string == "energy" ? translation = "Energia" : "";
            string == "physical" ? translation = "Físico" : "";
            string == "fire" ? translation = "Fogo" : "";
            string == "cold" ? translation = "Frio" : "";
            string == "magical" ? translation = "Mágico" : "";
            string == "necrotic" ? translation = "Necrótico" : "";
            string == "psychic" ? translation = "Psíquico" : "";
            string == "radiant" ? translation = "Radiante" : "";
            string == "acid" ? translation = "Ácido" : "";
            string == "thunder" ? translation = "Veneno" : "";
            string == "action" ? translation = "Ação" : "";
            string == "reaction" ? translation = "Reação" : "";
            string == "bonusAction" ? translation = "Ação Bônus" : "";
            string == "minute" ? translation = "Minuto(s)" : "";
            string == "hour" ? translation = "Hora(s)" : "";
            string == "day" ? translation = "Dia(s)" : "";

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