let controller = require('../../controller/import');

module.exports = [{
    method: 'post',
    path: '/import/add',
    controller: controller.add
},{
    method: 'get',
    path: '/import/list',
    controller: controller.list
},{
    method: 'post',
    path: '/import/del',
    controller: controller.del
},{
    method: 'get',
    path: '/import/detail',
    controller: controller.detail
}];



