
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
    }).catch(err => {
        throw err;
    });
}

const updateCharacterList = () => {
    fetch(`${API_URL}/characters`).then(res => {
        return res.status == 200 ? res.json() : {};
    }).then(json => {
        app.charactersList = [];
        json["characters"].forEach(character => app.charactersList.push(character));
    }).catch(err => {
        throw err;
    });
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