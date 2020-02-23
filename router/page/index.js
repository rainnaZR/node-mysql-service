let pageController = require('../../controller/page');

module.exports = [{
    method: 'post',
    path: '/page/add',
    controller: pageController.add
},{
    method: 'post',
    path: '/page/batchAdd',
    controller: pageController.batchAdd
},{
    method: 'get',
    path: '/page/detail',
    controller: pageController.detail
}, {
    method: 'get',
    path: '/page/list',
    controller: pageController.list
},{
    method: 'get',
    path: '/page/templateList',
    controller: pageController.templateList
}, {
    method: 'get',
    path: '/page/search',
    controller: pageController.list
}, {
    method: 'delete',
    path: '/page/:id',
    controller: pageController.del
}, {
    method: 'post',
    path: '/page/publish',
    controller: pageController.publish
}, {
    method: 'post',
    path: '/page/update',
    controller: pageController.update
}, {
    method: 'post',
    path: '/page/updateTrack',
    controller: pageController.updateTrack
}, {
    method: 'get',
    path: '/page/statusList',
    controller: pageController.statusList
}, {
    method: 'post',
    path: '/page/preview',
    controller: pageController.preview
}, {
    method: 'post',
    path: '/page/copy',
    controller: pageController.copy
}, {
    method: 'post',
    path: '/page/copyCheck',
    controller: pageController.copyCheck
}];
