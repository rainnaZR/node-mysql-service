const {query} = require('../index');
const {sqlUpdate} = require('../../utils/index');
const {PAGE_MODULE_STATUS} = require('../constants');

// 根据moduleId给页面添加模块
const add = (val) => {
    let {pageId, cityId, moduleId, pageModuleOrder} = val;
    // 先取module配置信息
    let sql  = `select * from tbl_lb_module where id = ?;`;
    let value = [moduleId];

    // 再存page_module信息
    sql += 'INSERT INTO tbl_lb_page_module(page_module_id,page_id,module_id,city_id,page_module_order) VALUES(0,?,?,?,?)';
    value.push(pageId, moduleId, cityId, pageModuleOrder);

    return query(sql, value);
};

// 更新module信息
const update = (val) => {
    let {module, pageModuleOrder} = val;
    let {pageModuleId, pageModuleTitle, marginTop, bgColor, fenceData, moduleId, styleConfigMap, dataConfigMap, businessData} = module;
    if(!!fenceData) fenceData = JSON.stringify(fenceData);
    if(!!styleConfigMap) styleConfigMap = JSON.stringify(styleConfigMap);
    if(!!dataConfigMap) dataConfigMap = JSON.stringify(dataConfigMap);
    if(!!businessData) businessData = JSON.stringify(businessData);
    marginTop = parseInt(marginTop)||0;

    let _sql = 'update tbl_lb_page_module set ';
    let { sql, args } = sqlUpdate({page_module_title:pageModuleTitle,margin_top:marginTop,bg_color:bgColor,fence_data:fenceData,module_id:moduleId,style_config_map:styleConfigMap,data_config_map:dataConfigMap,business_data:businessData,page_module_order:pageModuleOrder}, _sql);
    _sql = sql + 'where page_module_id = ?';

    return query( _sql, [...args, pageModuleId] );
};

//删除模块
const del = (val) => {
    const {pageModuleId} = val;
    const sql = 'update tbl_lb_page_module set page_module_status = ? where page_module_id = ?';
    return query(sql, [PAGE_MODULE_STATUS.INVALID, pageModuleId]);
};

module.exports = {
    add,
    update,
    del
};
