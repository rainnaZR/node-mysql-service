const service = require('../index');
const {success, failed} = require('../common');
let {dataFormat, dateFormat} = require('../../utils');

module.exports = {
    'add': service('import', 'add'),
    'del': service('import', 'del'),
    'list': service('import', 'list', (result, params) => {
        if(!result || result.length != 2){
            return failed({
                message: '数据返回值错误'
            });
        }
        result[0].map(item => {
            item.expire_time = dateFormat(item.expire_time);
            item.create_time = dateFormat(item.create_time);
        });
        return success({
            list: dataFormat(result[0]),
            pagerInfo: {
                currentPage: params.currentPage,
                sizePerPage: params.sizePerPage,
                totalSize: result[1][0]['FOUND_ROWS()']
            }
        });
    }),
    'detail': service('import', 'detail')
};
