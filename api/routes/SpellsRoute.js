'use strict';

module.exports = function (app) {
    var spellController = require('../controllers/SpellsController');

    app.route('/spells')
        .get(spellController.getAllSpellList)
        .put(spellController.updateSpell)
        .post(spellController.createNewSpell);

    app.route('/spells/constants')
        .get(spellController.getConstants);

    app.route('/spells/:id')
        .get(spellController.getSpellById)
        .delete(spellController.deleteSpell);
};