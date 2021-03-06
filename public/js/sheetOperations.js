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
    return parseInt(classe.value) > 0 ? true : app.selectedCharacter.classes.splice(index, 1);
}

const addNewCharacter = () => {
    const name = document.getElementById('newCharacterName').value.length ? document.getElementById('newCharacterName').value : "Novo Personagem";
    const obj = JSON.stringify({ "name": name });
    const myheaders = {
        "content-type": "application/json",
        "user": app.userId
    }

    fetch(`${API_URL}/characters`, {
        method: 'POST',
        headers: myheaders,
        body: obj
    }).then(res => {
        if (res.status == 200) {
            updateCharacterList();
        }
    }).catch(err => {
        throw err;
    });
}

const updateCharacterList = () => {
    fetch(`${API_URL}/characters`, {
        headers: {
            "user": app.userId
        }
    }).then(res => {
        return res.status == 200 ? res.json() : {};
    }).then(json => {
        app.charactersList = json["characters"];
    }).catch(err => {
        throw err;
    });
}

const updateSpellsList = () => {
    fetch(`${API_URL}/spells`, {
        method: "GET",
        headers: {
            "user": app.userId
        }
    }).then(res => {
        if (res.status == 200) {
            return res.json();
        }
    }).then(json => {
        app.allSpells = json.spells.sort((a, b) => {
            if (a.name > b.name) {
                return 1;
            }
            if (a.name < b.name) {
                return -1;
            }

            return 0;
        });
    }).catch(err => {
        throw err;
    });
}

const updateSelectedCharacter = (char) => {
    app.selectedCharacter = char;
};

const logOut = () => {
    fetch(`${API_URL}/user/logout`, {
        headers: {
            "user": app.userId
        }
    }).then(res => {
        if (res.status == 200) {
            return res.text();
        }
    }).then(text => {
        app.userId = 0;
        setTimeout(() => {
            app.showHomePage = false;
            app.showCharacterSheet = false;
            app.showDetailsSheet = false;
            app.showDiary = false;
            app.showSpellSheet = false
            setTimeout(() => app.showLogin = true, DURATION);
        }, DURATION);
        for (let i = 0; i < 9; i++) {
            setTimeout(() => app.showHabilityScores[i] = false, i * 100);
        }
    });
}

const goToCharacterSheet = () => {
    app.showLogin = false;
    app.showHomePage = false;
    app.showSpellSheet = false;
    app.showDetailsSheet = false;
    app.showDiary = false;
    setTimeout(() => {
        app.showCharacterSheet = true;
        dispatchHabilityScoresAnimation();
    }, DURATION);

};

const goToSpellSheet = () => {
    setTimeout(() => {
        app.showLogin = false;
        app.showHomePage = false;
        app.showCharacterSheet = false;
        app.showDetailsSheet = false;
        app.showDiary = false;
        setTimeout(() => app.showSpellSheet = true, DURATION);
    }, DURATION);
    for (let i = 0; i < 9; i++) {
        setTimeout(() => app.showHabilityScores[i] = false, i * 100);
    }
}

const goToDetailsSheet = () => {
    setTimeout(() => {
        app.showLogin = false;
        app.showHomePage = false;
        app.showCharacterSheet = false;
        app.showSpellSheet = false;
        app.showDiary = false;
        setTimeout(() => app.showDetailsSheet = true, DURATION);
    }, DURATION);
    for (let i = 0; i < 9; i++) {
        setTimeout(() => app.showHabilityScores[i] = false, i * 100);
    }
}

const goToDiary = () => {
    setTimeout(() => {
        app.showLogin = false;
        app.showHomePage = false;
        app.showCharacterSheet = false;
        app.showDetailsSheet = false;
        app.showSpellSheet = false;
        setTimeout(() => app.showDiary = true, DURATION);
    }, DURATION);
    for (let i = 0; i < 9; i++) {
        setTimeout(() => app.showHabilityScores[i] = false, i * 100);
    }
}

const backToHomePage = () => {
    setTimeout(() => {
        app.showSpellSheet = false;
        app.showCharacterSheet = false;
        app.showDetailsSheet = false;
        app.showDiary = false;
        setTimeout(() => app.showHomePage = true, DURATION);
    }, DURATION);
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

const addNewFeature = () => {
    const newFeature = {
        "title": document.getElementById('featureTitle').value,
        "description": document.getElementById('featureDescription').value,
        "origin": document.getElementById('featureOrigin').value
    };

    app.selectedCharacter.featuresArray.push(newFeature);
    app.modal = 'Habilidades';
}

const addSpell = (spell) => {
    const alreadyHave = app.selectedCharacter.spellCasting.spellsList.filter(listedSpell => listedSpell.id == spell.id);

    if (alreadyHave.indexOf(spell.id) > -1) {
        window.alert("Voc?? j?? possui essa magia");
        return false;
    }

    app.selectedCharacter.spellCasting.spellsList.push(spell);
    return true;
};

const clearSpellForm = () => {
    document.getElementById("newSpellName").value = "";
    document.getElementById("newSpellSchool").value = "";
    document.getElementById("newSpellLevel").value = "";
    document.getElementById("newSpellClasses").value = "";
    document.getElementById("newSpellCastTimeCount").value = "";
    document.getElementById("newSpellCastTimeType").value = "";
    document.getElementById("newSpellIsRitual").checked = false;
    app.newSpell.range == 'ranged' ? document.getElementById("newSpellRange").value = "" : true;
    document.getElementById("newSpellDuration").value = "";
    document.getElementById("newSpellVerbalComponent").checked = false;
    document.getElementById("newSpellSomaticComponent").checked = false;
    document.getElementById("newSpellMaterialComponent").value = "";
    document.getElementById("newSpellDescription").value = "";
    document.getElementById("newSpellOrigin").value = "";
};

const addNewSpell = async () => {
    const newSpell = {
        name: document.getElementById("newSpellName").value,
        school: document.getElementById("newSpellSchool").value,
        level: document.getElementById("newSpellLevel").value,
        classes: document.getElementById("newSpellClasses").value,
        casting: {
            "time": document.getElementById("newSpellCastTimeCount").value,
            "type": document.getElementById("newSpellCastTimeType").value,
            "ritual": document.getElementById("newSpellIsRitual").checked
        },
        range: {
            "type": app.newSpell.range,
            "distance": app.newSpell.range == 'ranged' ? document.getElementById("newSpellRange").value : null
        },
        damages: app.newSpell.damages,
        conditions: app.newSpell.conditions,
        duration: document.getElementById("newSpellDuration").value,
        components: {
            "verbal": document.getElementById("newSpellVerbalComponent").checked,
            "somatic": document.getElementById("newSpellSomaticComponent").checked,
            "material": document.getElementById("newSpellMaterialComponent").value
        },
        description: document.getElementById("newSpellDescription").value,
        origin: document.getElementById("newSpellOrigin").value,
    };

    const obj = JSON.stringify({ spellInfo: newSpell });
    const myheaders = {
        "content-type": "application/json",
        "user": app.userId
    }

    const res = await fetch(`${API_URL}/spells`, {
        method: 'POST',
        headers: myheaders,
        body: obj
    }).catch(err => {
        throw err;
    });

    const json = await res.json();

    addSpell({ ...json, ...newSpell });
    clearSpellForm();
    updateSpellsList();
    app.modal = 'Adicionar Magia';
};

const addNewAction = (type, backTo) => {
    const hitType = document.getElementById('actionHitType').value;
    const hitOrDC = document.getElementById('actionHitDC').value;
    let newMainAction = {
        "name": document.getElementById('actionName').value,
        "damage": document.getElementById('actionDamage').value,
        "damageType": document.getElementById('actionDamageType').value ? `[${document.getElementById('actionDamageType').value}]` : '',
        "description": document.getElementById('actionDescription').value
    };

    hitType == "hit" ?
        newMainAction["hit"] = hitOrDC :
        newMainAction["difficultyClass"] = hitOrDC;

    app.selectedCharacter.actions[type].push(newMainAction);
    app.modal = backTo;
}

const updateSaves = (type) => {
    app.selectedCharacter.deathSaves[type] < 3 ?
        app.selectedCharacter.deathSaves[type] += 1 :
        app.selectedCharacter.deathSaves[type] = 0;
}

updateCharacterList();
updateSpellsList();