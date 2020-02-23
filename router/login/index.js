let loginController = require('../../controller/login');

module.exports = [{
    method: 'post',
    path: '/login',
    controller: loginController.login
}];
