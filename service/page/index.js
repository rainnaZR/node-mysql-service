const {query} = require('../index');
const {sqlUpdate} = require('../../utils/index');
const {redisConfig, getRedis, disconnectRedis} = require('../redis');
const {PAGE_STATUS, PAGE_CITY_STATUS, PAGE_MODULE_STATUS, PAGE_TYPE} = require('../constants');
const cityService = require('../city');
const debug = require('debug')('db');
let _cityEnum;

// redis page基础信息key
const _pageBaseKey = (pageId) => {
    return `lb:activity_page:page_id:${pageId}`;
};
// redis 页面搭建信息key
const _pageBuildKey = (cityId, pageId) => {
    return `lb:activity_page_module:city_id:${cityId}:page_id:${pageId}`;
};
// 获取所有城市列表
const _getCityList = async function() {
    _cityEnum = await cityService.get();
};
_getCityList();

const _deleteRedisByCity = function(cityId, key) {
    let client = null;

    return getRedis(cityId)
        .then(redisClient => {
            client = redisClient;
            return redisClient.del(key);
        })
        .then(count => {
            disconnectRedis(client);
            return count;
        });
};

//新增页面
const add = (params) => {
    const { title, expireTime, expireLink, expireDelayDay, bgColor, bgImageUrl, paddingBottom, shareContent, cityList, sessionUser = {username: 'system'}, pageStatus = PAGE_STATUS.NORMAL, pageType = PAGE_TYPE.CITY_PAGE, trackId = 0, extraContent = '' } = params;
    const sql = `insert into tbl_lb_page
        (
            title,
            expire_time,
            expire_link,
            expire_delay_day,
            bg_color,
            bg_image_url,
            padding_bottom,
            share_content,
            city_list,
            track_id,
            extra_content,
            page_status,
            page_type,
            create_user,
            update_user,
            create_time,
            update_time
        ) values (?,?,?,?,?, ?,?,?,?,?,?,?,?,?,?,now(),now())
        `;
    const values = [
        title,
        expireTime,
        expireLink,
        expireDelayDay,
        bgColor,
        bgImageUrl,
        paddingBottom,
        shareContent,
        cityList,
        trackId,
        extraContent,
        pageStatus, // pageStatus
        pageType,
        sessionUser.username, // createUser
        sessionUser.username // updateUser
    ];

    return query(sql, values)
        .then(res => res.insertId)
        .then(pageId => {
            let valList;
            if (Number(cityList) === 0) {
                // 全国通用
                valList = `(${Number(cityList)},${pageId},${PAGE_CITY_STATUS.SAVED})`;
            } else {
                const cityIds = cityList.split(',');
                valList = _cityEnum.map(item => {
                    let cityId = item.id;
                    if(cityIds.indexOf(String(cityId)) > -1){
                        return `(${cityId},${pageId},${PAGE_CITY_STATUS.SAVED})`;
                    }else{
                        return `(${cityId},${pageId},${PAGE_CITY_STATUS.INVALID})`;
                    }
                });
            }
            const cityPageSql = `insert into tbl_lb_page_city (city_id, page_id, page_city_status) values ${valList}`;
            query(cityPageSql, valList);
            return { id: pageId, title }; // 没必要返回全部字段
        });
};

// 批量新增页面
const batchAdd = (params) => {
    const { pageId, cityId, pageCount, sessionUser = {username: 'system'} } = params;
    return detail({ pageId, type: 2 }).then(result => {
        // 获取页面详情
        let res = result[0][0];
        let moduleList = result[1];
        let addParams = {
            title: `${res.title}_copy`,
            expireTime: res.expire_time,
            expireLink: res.expire_link,
            expireDelayDay: res.expire_delay_day,
            bgColor: res.bg_color,
            bgImageUrl: res.bg_image_url,
            paddingBottom: res.padding_bottom,
            shareContent: res.share_content,
            sessionUser,
            cityList: String(cityId),
            pageStatus: PAGE_STATUS.NORMAL,
            pageType: PAGE_TYPE.CITY_PAGE,  // todo: 是否是city_page的类型
            trackId: res.track_id,
            extraContent: res.extra_content
        };
        let promises = [];
        for(var i = 0; i < pageCount; i ++ ){
            promises.push(add(addParams));
        }
        // 第一步，tbl_page, tbl_page_city表数据更新
        return Promise.all(promises).then(res => {
            // 第二步，tbl_lb_page_module表数据更新
            // 当被复制的页面是空页面时，则不需要向新页面插入模块数据
            if(!moduleList.length) return res;

            let sql = `insert into tbl_lb_page_module (city_id, page_id, page_module_status, business_data, margin_top, bg_color, fence_data, module_id, page_module_title, page_module_order, style_config_map, data_config_map) values ?`;
            let moduleValues = [];
            res.forEach(page => {
                let id = page.id;
                moduleList.forEach(module => {
                    moduleValues.push([
                        cityId,
                        id,
                        PAGE_MODULE_STATUS.NORMAL,
                        module.business_data,
                        module.margin_top,
                        module.bg_color,
                        module.fence_data,
                        module.module_id,
                        module.page_module_title,
                        module.page_module_order,
                        module.style_config_map,
                        module.data_config_map
                    ]);
                });
            });
            return query(sql, [moduleValues]);
        });
    });
};

//更新页面
const update = (params) => {
    let oldCityIdStr = '';
    const { id, title, expireTime, expireLink, bgColor, paddingBottom, bgImageUrl, shareContent, expireDelayDay, extraContent, cityList, sessionUser = {username: 'system'}, pageStatus = PAGE_STATUS.NORMAL, pageType = PAGE_TYPE.CITY_PAGE } = params;

    const pageSql = 'select city_list from tbl_lb_page where id = ?';
    // 先查再更新，保证获取到的是旧的城市列表

    return query(pageSql, [id])
        .then(pages => oldCityIdStr = pages[0] && pages[0].city_list)
        .then(() => {
            let _sql = 'update tbl_lb_page set ';
            const { sql, args } = sqlUpdate({
                title,
                expire_time: expireTime,
                expire_link: expireLink,
                bg_color: bgColor,
                bg_image_url: bgImageUrl,
                padding_bottom: paddingBottom,
                share_content: shareContent,
                expire_delay_day: expireDelayDay,
                extra_content: extraContent,
                city_list: cityList,
                update_user: sessionUser.username,
                page_status: pageStatus, // 页面状态正常
                page_type: pageType
            }, _sql);
            _sql = sql + ', update_time = now() where id = ?;';
            return query( _sql, [...args, id]).then(() => cityList);
        })
        .then(() => {
            const cityIds = cityList && cityList.split(',');
            const pageKey = _pageBaseKey(id);

            // 每次更新页面时， 清除redis缓存
            const promises = cityIds.map(cityId => _deleteRedisByCity(cityId, pageKey));
            // 数量暂时没用，不做处理
            Promise.all(promises).catch(err => console.error(err));

            // 新旧同时有，不改城市状态
            const keepCityIds = oldCityIdStr.split(',').filter(cityId => cityIds.includes(cityId));

            let newSql = `update tbl_lb_page_city set update_time = now(), update_user = '${sessionUser.username}', page_city_status = case city_id \n`;
            // case then 没有涉及到的分支，default 为null... 所以要通过where子句过滤更新范围，减少case分支容易造成 bug
            _cityEnum.forEach(item => {
                let cityId = item.id;
                // toto: 已有城市的页面状态需要保留
                if(cityIds.indexOf(String(cityId)) > -1){
                    newSql += `when ${cityId} then ${PAGE_CITY_STATUS.SAVED} \n`;
                }else{
                    newSql += `when ${cityId} then ${PAGE_CITY_STATUS.INVALID} \n`;
                }
            });
            newSql += `end \n`;
            newSql += `where page_id = ${id} `;

            if (keepCityIds.length) {
                newSql += ` and city_id not in (${keepCityIds.join(',')})`;
            }

            query(newSql);
            return {id, title};
        });
};

//根据页面id查询页面信息
const detail = val => {
    let { pageId, cityId, type } = val;
    let sql = 'select * from tbl_lb_page where id = ?;';
    let value = [pageId];

    if(type == 1){
        // 根据城市查模块信息
        sql += 'select * from tbl_lb_page_module where page_id = ? and city_id = ? and page_module_status = ? order by page_module_order ASC;';
        sql += 'select * from tbl_lb_module;';
        value.push(pageId, cityId, PAGE_MODULE_STATUS.NORMAL);
        return query(sql, value);
    }else if(type == 2){
        // 用于查询页面里包含的模块信息
        sql += 'select * from tbl_lb_page_module where page_id = ? and page_module_status = ? order by page_module_order ASC;';
        value.push(pageId, PAGE_MODULE_STATUS.NORMAL);
        return query(sql, value);
    }else{
        return query(sql, value);
    }
};

//查询页面
const list = params => {
    const { currentPage = 1, sizePerPage = 10, type, keywords, groupType = 0, pageStatus = PAGE_STATUS.NORMAL, pageType = PAGE_TYPE.CITY_PAGE, sessionUser = {username: 'system'} } = params;
    // groupType：0 全部 1 我操作的 2 我删除的
    const groupTypeInt = parseInt(groupType);
    const start = (currentPage - 1) * sizePerPage;

    // todo:接账号
    let sql = 'select SQL_CALC_FOUND_ROWS * from tbl_lb_page where page_status = ?';
    let value = [];
    // groupType: 0 全部
    if(groupTypeInt == 0){
        value.push(parseInt(pageStatus));
    }
    // groupType：1 我操作的
    if(groupTypeInt == 1){
        sql += ' and update_user = ?';
        value.push(parseInt(pageStatus));
        value.push(sessionUser.username);
    }
    // groupType：2 我删除的
    if (groupTypeInt == 2){
        sql += ' and update_user = ?';
        value.push(PAGE_STATUS.INVALID);
        value.push(sessionUser.username);
    }
    // 如果是分城页面，需要兼容老数据，也就是pageType = 1 || 0
    if (pageType == PAGE_TYPE.CITY_PAGE) {
        sql += ' and (page_type = ? or page_type = ?)';
        value.push(pageType);
        value.push(PAGE_TYPE.DEFAULT);
    } else {
        sql += ' and page_type = ?';
        value.push(pageType);
    }

    //页面ID搜索
    if(keywords && type == 1){
        sql += ' and id = ?';
        value.push(keywords);
    }

    //页面标题搜索
    if(keywords && type == 2){
        sql += ' and title like ?';
        value.push(`%${keywords}%`);
    }

    //分页查询
    sql += ` order by id desc limit ${start},${sizePerPage};SELECT FOUND_ROWS();`;
    return query(sql, value);
};

// 查询所有模版页面的列表
const templateList = () => {
    let sql = 'select * from tbl_lb_page where page_type = ?';
    let value = [PAGE_TYPE.TEMPLATE];
    return query(sql, [value]).then(res => {
        let newRes = [];
        res.forEach(res => {
            newRes.push({
                id: res.id,
                title: res.title
            });
        });
        return newRes;
    });
};

// 批量查看城市页面状态
const statusList = params => {
    const { pageIds = '' } = params;
    const sql = `select page_id, GROUP_CONCAT(city_id, ':', page_city_status SEPARATOR ',') as status from tbl_lb_page_city
     where page_id in (${pageIds}) and page_city_status != ${PAGE_CITY_STATUS.INVALID} group by page_id`;

    return query(sql);
};

//仅保存，模块排序更新
const updateOrder = val => {
    let {pageId, cityId, moduleIds} = val;
    let sql = 'update tbl_lb_page_module set page_module_order = case page_module_id \n';
    moduleIds.forEach((id, index) => {
        sql += `when ${id} then ${index} \n`;
    });
    sql += 'end';
    sql += ` where page_id = ${pageId} and city_id = ${cityId}`;
    return query(sql);
};

//仅发布
const onlyPublish = val => {
    let {pageId, cityId, sessionUser = {username: 'system'} } = val;
    let sql = 'update tbl_lb_page_city set page_city_status = ?, update_time = now(), update_user = ? where page_id = ? and city_id = ?';
    return query(sql, [PAGE_CITY_STATUS.PUBLISHED, sessionUser.username, pageId, cityId]).then(() => {
        // 清除redis缓存
        // if(cityId === 0){
        //     // 把所有redis都清掉
        //     let promises = Object.keys(redisConfig).map(key => _deleteRedisByCity(key, _pageBuildKey(key, pageId)));
        //     return Promise.all(promises).then(res => {
        //         return {
        //             pageId,
        //             cityId,
        //             deleteRedis: res
        //         };
        //     }).catch(err => console.error(err));
        // }
        return _deleteRedisByCity(cityId, _pageBuildKey(cityId, pageId)).then(res => {
            return {
                pageId,
                cityId,
                deleteRedis: res
            };
        }).catch(error => console.error(error));
    });
};

// 发布页面 - update 一种
const publish = val => {
    let type = val.type||1;
    //页面仅保存
    if(type == 1){
        return updateOrder(val);
    }
    //页面仅发布
    if(type == 2){
        return onlyPublish(val);
    }
    //页面保存并发布
    if(type == 3){
        return updateOrder(val).then(() => onlyPublish(val));
    }
};

// 删除页面
const del = (params) => {
    const { id, sessionUser = {username: 'system'} } = params;
    const sql = 'update tbl_lb_page set page_status = ? , update_time = now(), update_user = ? where id = ?';
    return query(sql, [PAGE_STATUS.INVALID, sessionUser.username, id]);
};


// 预览
const preview = params => {
    const { id, cityId } = params;
    const sqls = [
        'select id, title, expire_link, expire_time, expire_delay_day, bg_color, bg_image_url, padding_bottom, share_content, extra_content, track_id from tbl_lb_page where id = ?',
        'select * from tbl_lb_page_module where page_id = ? and city_id = ? and page_module_status = ? order by page_module_order ASC',
        'select id, property_type, view_component_name, track_id from tbl_lb_module'
    ];
    const values = [id, id, cityId, PAGE_MODULE_STATUS.NORMAL];

    return query(sqls.join(';'), values);
};

// 复制页面
const copy = params => {
    const { fromCityId, toCityIds = '', pageId } = params;
    const columns = 'page_id, business_data, margin_top, bg_color, fence_data, module_id, page_module_title, page_module_order, style_config_map, data_config_map';
    const fromSql = `select ${columns} from tbl_lb_page_module where page_id = ? and city_id = ? and page_module_status = ?`;

    return query(fromSql, [pageId, fromCityId, PAGE_MODULE_STATUS.NORMAL])
        .then(modules => {
            if (modules.length === 0) {
                return Promise.reject(new Error('不能复制没有搭建的页面'));
            } else {
                return modules;
            }
        })
        .then(modules => {
            const promises = toCityIds.split(',').map(cityId => {
                // 这里不校验 city 是否是否有模块记录，前端限制即可
                const places = modules.map(() => `(?,?,?,?,?, ?,?,?,?,?, ?,?)`).join(',');
                const insertSql = `insert into tbl_lb_page_module(city_id, page_module_status, ${columns}) values ${places}`;

                const values = [];
                modules.forEach(mod => {
                    values.push(
                        cityId,
                        PAGE_MODULE_STATUS.NORMAL,
                        mod.page_id,
                        mod.business_data,
                        mod.margin_top,
                        mod.bg_color,
                        mod.fence_data,
                        mod.module_id,
                        mod.page_module_title,
                        mod.page_module_order,
                        mod.style_config_map,
                        mod.data_config_map
                    );
                });

                return query(insertSql, values);
            });

            return Promise.all(promises);
        });
};

// 检查页面
const copyCheck = params => {
    const { pageId, cityId } = params;

    // 查看是否可复制
    const sql = 'select count(page_module_id) as count from tbl_lb_page_module where page_id = ? and city_id = ? and page_module_status = ?';

    return query(sql, [pageId, cityId, PAGE_MODULE_STATUS.NORMAL])
        .then(result => {
            const count = result[0].count;
            if(count === 0) {
                throw new Error('不可复制');
            }
            return count;
        })
        .then(() => {
            // 查找页面所有城市
            const otherCitySql = 'select city_id from tbl_lb_page_city where page_id = ? and city_id != ? and page_city_status != ?';
            return query(otherCitySql, [pageId, cityId, PAGE_CITY_STATUS.INVALID])
                .then(res => res.map(item => parseInt(item.city_id)));
        })
        .then(otherCityIds => {
            // 能查到记录说明该城市已经有模块
            const findSql = `select city_id from tbl_lb_page_module where page_id = ? and page_module_status = ? and city_id in (${otherCityIds.join(',')})`;

            return query(findSql, [pageId, PAGE_MODULE_STATUS.NORMAL])
                .then(res => {
                    const existCityIds = res.map(item => parseInt(item.city_id));
                    const cityIds = otherCityIds.filter(id => !existCityIds.includes(id));

                    return { should: true, cityIds };
                });
        })
        .catch(err => {
            debug(`页面复制检测: ${err.message}`);
            return { should: false, cityIds: [] };
        });
};

// 更新页面埋点信息
const updateTrack = params => {
    const {id, trackId} = params;
    let sql = `update tbl_lb_page set track_id = ? where id = ?`;
    let value = [trackId, id];

    return query(sql, value).then(res => {
        return {
            id,
            trackId
        };
    });
};

module.exports = {
    add,
    batchAdd,
    detail,
    update,
    publish,
    list,
    templateList,
    del,
    statusList,
    preview,
    copy,
    copyCheck,
    updateTrack
};
