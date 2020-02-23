let cityController = require('../../controller/city');

module.exports = [{
    method: 'get',
    path: '/cityList',
    controller: cityController.city
}];



