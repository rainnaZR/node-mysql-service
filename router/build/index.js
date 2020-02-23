let buildController = require('../../controller/build');

module.exports = [{
    method: 'post',
    path: '/build/add',
    controller: buildController.add
},{
    method: 'post',
    path: '/build/update',
    controller: buildController.update
},{
    method: 'post',
    path: '/build/del',
    controller: buildController.del
}];
