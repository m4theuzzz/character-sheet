'use strict';

module.exports = function (app) {
    var characterSheetController = require('../controllers/CharacterSheetController');

    app.route('/characterSheet/:id')
        .get(characterSheetController.startCharacterSheet)
        .put(characterSheetController.updateCharacterSheet);
};