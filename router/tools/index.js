let controller = require('../../controller/tools');

module.exports = [{
    method: 'post',
    path: '/upload',
    controller: controller.upload
}, {
    method: 'post',
    path: '/uploadBlob',
    controller: controller.uploadBlob
}];



