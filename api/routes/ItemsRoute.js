'use strict';

module.exports = function (app) {
    var itemsController = require('../controllers/ItemsController');

    app.route('/items')
        .get(itemsController.getAllItemsList)
        .put(itemsController.updateItem)
        .post(itemsController.createNewItem);

    app.route('/items/constants')
        .get(itemsController.getItemsConstants);

    app.route('/items/:id')
        .get(itemsController.getItemById)
        .delete(itemsController.deleteItem);
};