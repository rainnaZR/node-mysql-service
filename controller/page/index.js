const dayjs = require('dayjs');
const service = require('../index');
const {success, failed} = require('../common');
let {dataFormat, dateFormat} = require('../../utils');

module.exports = {
    'add': service('page', 'add'),
    'batchAdd': service('page', 'batchAdd'),
    'del': service('page', 'del'),
    'publish': service('page', 'publish'),
    'statusList': service('page', 'statusList'),
    'update': service('page', 'update'),
    'updateTrack': service('page', 'updateTrack'),
    'detail': service('page', 'detail', result => {
        if(result){
            // 仅返回页面信息
            if(result.length == 1){
                let res = dataFormat(result[0]);
                // 日期格式化
                if(res.expireTime) res.expireTime = dateFormat(res.expireTime);
                if(res.createTime) res.createTime = dateFormat(res.createTime);
                if(res.updateTime) res.updateTime = dateFormat(res.updateTime);
                return success(res);
            }
            // 返回页面信息+模块列表
            if(result.length > 1){
                let res = dataFormat(result[0][0]);
                res.moduleList = dataFormat(result[1]);
                // 遍历模块列表，把模块基础配置信息补充上去
                res.moduleList.forEach((module, index) => {
                    let baseModule = result[2].find((item) => item.id === module.moduleId);
                    module.fenceData = JSON.parse(module.fenceData||'{}');
                    module.businessData = JSON.parse(module.businessData);
                    module.styleConfigMap = JSON.parse(module.styleConfigMap)||{};
                    module.dataConfigMap = JSON.parse(module.dataConfigMap)||{};
                    res.moduleList[index] = {
                        ...module,
                        ...dataFormat(baseModule)
                    };
                });

                // 日期格式化
                if(res.expireTime) res.expireTime = dateFormat(res.expireTime);
                if(res.createTime) res.createTime = dateFormat(res.createTime);
                if(res.updateTime) res.updateTime = dateFormat(res.updateTime);

                return success(res);
            }
        }else{
            return failed({
                message: '数据返回值错误'
            });
        }
    }),
    'list': service('page', 'list', (result, params) => {
        if(!result || result.length != 2){
            return failed({
                message: '数据返回值错误'
            });
        }
        let list = dataFormat(result[0]);
        list.map(item => {
            // 日期格式化
            if(item.expireTime) item.expireTime = dateFormat(item.expireTime);
            if(item.createTime) item.createTime = dateFormat(item.createTime);
            if(item.updateTime) item.updateTime = dateFormat(item.updateTime);
        });
        return success({
            list,
            pagerInfo: {
                currentPage: params.currentPage,
                sizePerPage: params.sizePerPage,
                totalSize: result[1][0]['FOUND_ROWS()']
            }
        });
    }),

    // 获取模版页面列表
    templateList: service('page', 'templateList'),

    // 预览，实际上和详情接口没区别
    preview: service('page', 'preview', result => {
        if (!result || result.length < 1) {
            return failed({ message: '未查询到数据' });
        }

        const [pages, pageModules, modules] = result;
        const page = dataFormat(pages[0]);
        if (!page) {
            return success(page);
        }

        const moduleList = dataFormat(pageModules);

        // 遍历模块列表，把模块基础配置信息补充上去
        page.moduleList = moduleList.map(mod => {
            const baseModule = modules.find(m => m.id === mod.moduleId);

            return {
                ...mod,
                ...dataFormat(baseModule)
            };
        });

        page.currentTime = Date.now();
        // 日期格式化
        if(page.expireTime) page.expireTime = dayjs(page.expireTime).valueOf();

        return success(page);
    }),

    // 复制页面搭建模块信息
    copy: service('page', 'copy'),

    // 检查目标城市是否可复制，可复制到哪些城市
    copyCheck: service('page', 'copyCheck')
};
