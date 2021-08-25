const API_URL = "http://127.0.0.1:37456";

const DURATION = 300;

const app = new Vue({
    el: '#app',
    data: {
        showHomePage: true,
        showCharacterSheet: false,
        showHabilityScores: { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false },
        charactersList: [],
        selectedCharacter: {},
        modal: ""
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

                fetch(`${API_URL}/characterSheet/${updatedCharacter.characterId}`, {
                    method: "PUT",
                    headers: myHeader,
                    body: myBody
                }).then(res => {
                    if (res.status == 200) {
                        dispatchHabilityScoresAnimation();
                        return console.log(`O personagem: ${updatedCharacter.name} foi atualizado`);
                    }

                    console.log(res.status);
                }).catch(err => console.log(err));
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
            });
        },
        handleModalExhibition: (type) => {
            var myModal = new bootstrap.Modal(document.getElementById('modal'));
            app.modal = type;
            myModal.toggle();
        },
        deleteCharacter: (id) => {
            fetch(`${API_URL}/characters/${id}`, {
                method: 'DELETE'
            }).then(res => {
                updateCharacterList();
            });
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
        translate: (skill) => {
            let translation = ""

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
        }
    }
});

const recalculateHabilityScoreModifier = (habilityScore, value) => {
    const modifierCalculation = Math.trunc(parseInt(value) / 2) - 5;
    const modifier = modifierCalculation >= 0 ? `+${modifierCalculation}` : `${modifierCalculation}`
    app.selectedCharacter.baseModifiers[habilityScore] = modifier;
    recalculateSkillsScoreModifier(habilityScore, modifier);
}

const recalculateSkillsScoreModifier = (habilityScore, habilityScoreValue) => {
    const habilitySkills = app.selectedCharacter.skillScores[habilityScore];
    const proficiencyBonus = parseInt(app.proficiencyBonus);

    const halfProficiency = Math.trunc(0.5 * proficiencyBonus);
    const doubleProficiency = 2 * proficiencyBonus;

    for (const skill in habilitySkills) {
        if (app.selectedCharacter.skillScores[habilityScore][skill]["proficiency"] == "half") {
            const calc = parseInt(habilityScoreValue) + halfProficiency;
            app.selectedCharacter.skillScores[habilityScore][skill]["modifier"] = calc >= 0 ? `+${calc}` : `${calc}`;
            continue;
        }

        if (app.selectedCharacter.skillScores[habilityScore][skill]["proficiency"] == "full") {
            const calc = parseInt(habilityScoreValue) + proficiencyBonus;
            app.selectedCharacter.skillScores[habilityScore][skill]["modifier"] = calc >= 0 ? `+${calc}` : `${calc}`;
            continue;
        }

        if (app.selectedCharacter.skillScores[habilityScore][skill]["proficiency"] == "double") {
            const calc = parseInt(habilityScoreValue) + doubleProficiency;
            app.selectedCharacter.skillScores[habilityScore][skill]["modifier"] = calc >= 0 ? `+${calc}` : `${calc}`;
            continue;
        }

        app.selectedCharacter.skillScores[habilityScore][skill]["modifier"] = habilityScoreValue;
    }
}

const validateClassesExistence = (classe, index) => {
    parseInt(classe.value) > 0 ? true : app.selectedCharacter.classes.splice(index, 1);
}

const addNewCharacter = () => {
    const name = document.getElementById('newCharacterName').value.length ? document.getElementById('newCharacterName').value : "Novo Personagem";
    const obj = JSON.stringify({ "name": name });
    const myheaders = {
        "content-type": "application/json"
    }

    fetch(`${API_URL}/characters`, {
        method: 'POST',
        headers: myheaders,
        body: obj
    }).then(res => {
        if (res.status == 200) {
            updateCharacterList();
        }
    }).catch(err => console.log(err));
}

const updateCharacterList = () => {
    fetch(`${API_URL}/characters`).then(res => {
        return res.status == 200 ? res.json() : {};
    }).then(json => {
        app.charactersList = [];
        json["characters"].forEach(character => app.charactersList.push(character));
    }).catch(err => console.log(err));
}

const updateSelectedCharacter = (char) => {
    app.selectedCharacter = char;
};

const goToCharacterSheet = () => {
    app.showHomePage = false;
    setTimeout(() => app.showCharacterSheet = true, DURATION)
};

const backToHomePage = () => {
    app.showCharacterSheet = false;
    setTimeout(() => app.showHomePage = true, DURATION)
    for (let i = 0; i < 9; i++) {
        setTimeout(() => app.showHabilityScores[i] = false, i * 100);
    }
};

const dispatchHabilityScoresAnimation = () => {
    for (let i = 0; i < 9; i++) {
        setTimeout(() => app.showHabilityScores[i] = true, i * 100);
    }
};

const alternateSkillProficiencyType = (skill, hability) => {
    let position = app.selectedCharacter.halfProficienciesArray.indexOf(skill);
    const hasHalfProficiency = position != -1;
    if (hasHalfProficiency) {
        app.selectedCharacter.halfProficienciesArray.splice(position, 1);
        app.selectedCharacter.proficienciesArray.push(skill);
        app.selectedCharacter.skillScores[hability][skill]["proficiency"] = "full";
        return;
    }

    position = app.selectedCharacter.proficienciesArray.indexOf(skill);
    const hasFullProficiency = position != -1;
    if (hasFullProficiency) {
        app.selectedCharacter.proficienciesArray.splice(position, 1);
        app.selectedCharacter.doubleProficienciesArray.push(skill);
        app.selectedCharacter.skillScores[hability][skill]["proficiency"] = "double";
        return;
    }

    position = app.selectedCharacter.doubleProficienciesArray.indexOf(skill);
    const hasDoubleProficiency = position != -1;
    if (hasDoubleProficiency) {
        app.selectedCharacter.doubleProficienciesArray.splice(position, 1);
        app.selectedCharacter.skillScores[hability][skill]["proficiency"] = "none";
        return;
    }

    const hasntAnyProficiency = !hasHalfProficiency && !hasFullProficiency && !hasDoubleProficiency;
    if (hasntAnyProficiency) {
        app.selectedCharacter.halfProficienciesArray.push(skill)
        app.selectedCharacter.skillScores[hability][skill]["proficiency"] = "half";
    }
}

const addNewClass = () => {
    const newClassName = document.getElementById('newClassName').value;
    app.selectedCharacter.classes.push({ "name": newClassName, "value": 1 });
}

const addNewSpeed = () => {
    const newSpeedName = document.getElementById('newSpeedName').value;
    app.selectedCharacter.speedArray.push({ "name": newSpeedName, "value": 9 });
}

const addNewTrait = () => {
    const newTrait = document.getElementById('newTrait').value;
    app.selectedCharacter.personalityTraitsArray.push(newTrait);
}

const addNewIdeal = () => {
    const newIdeal = document.getElementById('newIdeal').value;
    app.selectedCharacter.idealsArray.push(newIdeal);
}

const addNewBond = () => {
    const newBond = document.getElementById('newBond').value;
    app.selectedCharacter.bondsArray.push(newBond);
}

const addNewFlaw = () => {
    const newFlaw = document.getElementById('newFlaw').value;
    app.selectedCharacter.flawsArray.push(newFlaw);
}

const updateSaves = (type) => {
    app.selectedCharacter.deathSaves[type] < 3 ?
        app.selectedCharacter.deathSaves[type] += 1 :
        app.selectedCharacter.deathSaves[type] = 0;
}

updateCharacterList();