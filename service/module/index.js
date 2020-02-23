const {query} = require('../index');
const {sqlUpdate} = require('../../utils/index');
const STATUS = {
    NORMAL: 1,
    INVALID: 2
};

//新增模块
const add = (val) => {
    const {name,introduce,groupType,propertyType,thumbImg,styleComponentName,dataComponentName,viewComponentName,createUser,updateUser,maintainUser,trackId,extraContent} = val;
    const sql = 'INSERT INTO tbl_lb_module(Id,name,introduce,group_type,property_type,thumb_img,style_component_name,data_component_name,view_component_name,maintain_user,track_id,extra_content,create_user,create_time,update_user,update_time,module_status) VALUES(0,?,?,?,?,?,?,?,?,?,?,?,?,now(),?,now(),1)';

    return query(sql, [name,introduce,groupType,propertyType,thumbImg,styleComponentName,dataComponentName,viewComponentName,maintainUser,trackId,extraContent,createUser,null,updateUser,null]);
};

//更新模块
const update = (val) => {
    const {id,name,introduce,groupType,propertyType,thumbImg,styleComponentName,dataComponentName,viewComponentName,createUser,updateUser,maintainUser,trackId,extraContent} = val;
    let _sql = 'update tbl_lb_module set ';
    const { sql, args } = sqlUpdate({ id, name, introduce, group_type: groupType, property_type: propertyType, thumb_img: thumbImg, style_component_name: styleComponentName, data_component_name: dataComponentName, view_component_name: viewComponentName, create_user: createUser, update_user: updateUser, maintain_user: maintainUser, track_id: trackId, extra_content: extraContent}, _sql);
    _sql = sql + 'where id = ?';

    return query( _sql, [...args, id] );
};

//根据模块id查询模块信息
const detail = val => {
    const { id } = val;
    const sql = 'select * from tbl_lb_module where id = ?';
    return query(sql, [id]);
};

//查询模块
const list = val => {
    let {type, keywords, groupType, currentPage = 1, sizePerPage = 10} = val;
    let sql = 'select SQL_CALC_FOUND_ROWS * from tbl_lb_module where module_status != ?';
    let value = [STATUS.INVALID];

    //模块标题搜索
    if(keywords && type == 1){
        sql += ' and name like "%" ? "%"';
        value.push(decodeURIComponent(keywords));
    }
    //模块id搜索
    if(keywords && type == 2){
        sql += ' and id = ?';
        value.push(decodeURIComponent(keywords));
    }
    //模块分组查询
    if(groupType > 0){
        sql += ' and group_type = ?';
        value.push(groupType);
    }
    //分页查询
    sql += ` order by id desc limit ${(currentPage-1)*sizePerPage},${sizePerPage};SELECT FOUND_ROWS();`;
    return query(sql, value);
};

//删除模块
const del = (val) => {
    const {id} = val;
    const sql = 'update tbl_lb_module set module_status = ? where id = ?';
    return query(sql, [STATUS.INVALID, id]);
};

module.exports = {
    add,
    detail,
    update,
    list,
    del
};

