const updateAllSavedItems = async () => {
    fetch(`${API_URL}/items`, {
        headers: {
            "user": app.userId
        }
    }).then(res => res.json()).then(json => {
        app.allSavedItems = json.items;
    }).catch(err => {
        throw err;
    });
}

const validateEquipmentExistence = (equipment, index) => {
    return parseInt(equipment.quantity) > 0 ? true : app.selectedCharacter.equipmentArray.splice(index, 1);
}

updateAllSavedItems();