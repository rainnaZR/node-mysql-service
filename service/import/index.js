const {query} = require('../index');
const {IMPORT_DATA_STATUS} = require('../constants');
const {dateFormat} = require('../../utils');

// 新增数据
const add = params => {
    const {list, sessionUser = {username: 'system'}} = params;
    let values = [];

    list.forEach(item => {
        const {title, expireTime, cityId = '0', cityName = '0', shopId = 0, dataContent, dataType = 1, categoryName} = item;
        let value = [
            `'${title}'`,
            `'${expireTime}'`,
            cityId,
            `'${cityName}'`,
            shopId,
            `'${dataContent}'`,
            dataType,
            `'${categoryName}'`,
            IMPORT_DATA_STATUS.NORMAL,
            `'${sessionUser.username}'`,
            'now()'
        ].join(',');
        values.push(`(${value})`);
    });
    const sql = `insert into tbl_lb_import_data (title, expire_time, city_id, city_name, shop_id, data_content, data_type, category_name, status, create_user, create_time) values ${values.join(',')}`;

    return query(sql).then(res => res.insertId);
};

// 查询数据
const list = val => {
    let {title, categoryName, id, cityId, currentPage = 1, sizePerPage = 10} = val;
    let sql = 'select SQL_CALC_FOUND_ROWS * from tbl_lb_import_data where status != ?';
    let value = [IMPORT_DATA_STATUS.INVALID];

    // 按活动标题搜索
    if(title){
        sql += ' and title like "%" ? "%"';
        value.push(decodeURIComponent(title));
    }
    // 按品类名称搜索
    if(categoryName){
        sql += ' and category_name like "%" ? "%"';
        value.push(decodeURIComponent(categoryName));
    }
    // 按数据id搜索
    if(id){
        sql += ' and id = ?';
        value.push(id);
    }
    // 按城市名称搜索
    if(cityId){
        sql += ' and city_id in (?, 0)';
        value.push(cityId);
    }
    //分页查询
    sql += ` order by id desc limit ${(currentPage-1)*sizePerPage},${sizePerPage};SELECT FOUND_ROWS();`;
    return query(sql, value);
};

// 删除数据
const del = (val) => {
    const {id} = val;
    const sql = 'update tbl_lb_import_data set status = ? where id = ?';
    return query(sql, [IMPORT_DATA_STATUS.INVALID, id]).then(res => res.affectedRows);
};

// 查询详情
const detail = val => {
    const { id } = val;
    const sql = 'select * from tbl_lb_import_data where id = ?';
    return query(sql, [id]).then(res => {
        res.map(item => {
            item.expire_time = dateFormat(item.expire_time);
        });
        return res;
    });
};

module.exports = {
    add,
    list,
    del,
    detail
};
