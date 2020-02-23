const service = require('../index');
const {success, failed} = require('../common');
let {dataFormat} = require('../../utils');

module.exports = {
    'add': service('module', 'add'),
    'del': service('module', 'del'),
    'detail': service('module', 'detail'),
    'update': service('module', 'update'),
    'list': service('module', 'list', (result, params) => {
        if(!result || result.length != 2){
            return failed({
                message: '数据返回值错误'
            });
        }
        return success({
            list: dataFormat(result[0]),
            pagerInfo: {
                currentPage: params.currentPage,
                sizePerPage: params.sizePerPage,
                totalSize: result[1][0]['FOUND_ROWS()']
            }
        });
    })
};
