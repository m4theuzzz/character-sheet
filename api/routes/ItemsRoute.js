'use strict';

module.exports = function (app) {
    var itemsController = require('../controllers/ItemsController');

    app.route('/items')
        .get(itemsController.getAllItemsList)
        .put(itemsController.updateItem)
        .post(itemsController.createNewItem);

    app.route('/items/itemTypes')
        .get(itemsController.getItemTypes);

    app.route('/items/rarities')
        .get(itemsController.getRarities);

    app.route('/items/:id')
        .get(itemsController.getItemById)
        .delete(itemsController.deleteItem);
};