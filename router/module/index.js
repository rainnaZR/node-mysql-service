let moduleController = require('../../controller/module');

module.exports = [{
    method: 'post',
    path: '/module/add',
    controller: moduleController.add
},{
    method: 'get',
    path: '/module/detail',
    controller: moduleController.detail
},{
    method: 'post',
    path: '/module/update',
    controller: moduleController.update
},{
    method: 'get',
    path: '/module/list',
    controller: moduleController.list
},{
    method: 'post',
    path: '/module/del',
    controller: moduleController.del
}];
