const service = require('../index');
const {success, failed} = require('../common');

module.exports = {
    'update': service('build', 'update'),
    'del': service('build', 'del'),
    'add': service('build', 'add', (result) => {
        if(!result || result.length != 2){
            return failed({
                message: '数据返回值错误'
            });
        }

        let moduleInfo = result[0][0];
        moduleInfo.moduleId = moduleInfo.id;
        delete(moduleInfo.id);
        return success({
            pageModuleId: result[1].insertId,
            ...moduleInfo
        });
    })
};
