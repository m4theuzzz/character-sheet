const apiUrl = "";

let base = document.getElementById("responses");
let breakLine = document.createElement('br');

let loadCharacterSheet = (id) => {
    fetch(`${apiUrl}/characterSheet/${id}`, {
        headers: {
            "user": app.userId
        }
    })
        .then(res => {
            if (res.status == 200) {
                return res.json();
            }
        })
        .then(json => {
            console.log(json["character"]);
        });
};

let writeResponseInBase = (responseText, id) => {
    let paragraph = document.createElement('div');
    paragraph.innerText = responseText;
    paragraph.onclick = () => loadCharacterSheet(id);

    base.appendChild(paragraph);
    base.appendChild(breakLine);
};

let addChar = () => {
    let name = document.getElementById('characterName').value;
    let obj = JSON.stringify({ "name": name });
    let myheaders = {
        "content-type": "application/json",
        "user": app.userId
    }
    fetch(`${apiUrl}/characters`, {
        method: 'POST',
        headers: myheaders,
        body: obj
    }).then(res => {
        if (res.status == 200) {
            updatePage();
        }
    }).catch(err => console.log(err));
};

let updatePage = () => {
    base.innerText = "";
    fetch(`${apiUrl}/characters`, {
        headers: {
            "user": app.userId
        }
    }).then(res => {
        if (res.status == 200) {
            return res.json();
        }
    }).then(json => {
        json["characters"].map((character) => {
            let text = "";
            text += `${character.characterId}: ${character.name}`;
            writeResponseInBase(text, character.characterId);
        });

    }).catch(err => console.log(err));
}

(global => {
    updatePage();
})()