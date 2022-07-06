'use strict';

module.exports = function (app) {
    var userController = require('../controllers/UsersController');

    app.route('/user')
        .get(userController.getUser);
}