'use strict';

module.exports = function (app) {
    var charactersController = require('../controllers/CharactersController');

    app.route('/characters')
        .get(charactersController.getCharactersList)
        .post(charactersController.createNewCharacter);


    app.route('/characters/:id')
        .delete(charactersController.deleteCharacter);
};