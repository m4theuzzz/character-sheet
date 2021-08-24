'use strict';

module.exports = function (app) {
    var spellController = require('../controllers/SpellsController');

    app.route('/spell')
        .get(spellController.getAllSpellList)
        .put(spellController.updateSpell)
        .post(spellController.createNewSpell);

    app.route('/spell/castingTypes')
        .get(spellController.getCastingTypes);

    app.route('/spell/durationTypes')
        .get(spellController.getDurationTypes);

    app.route('/spell/durationTimeCount')
        .get(spellController.getDurationTimeCount);

    app.route('/spell/rangeTypes')
        .get(spellController.getRangeTypes);

    app.route('/spell/:id')
        .get(spellController.getSpellById)
        .delete(spellController.deleteSpell);
};