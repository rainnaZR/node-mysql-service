const {query} = require('../index');

//获取城市列表
const get = () => {
    return query('SELECT * FROM tbl_city WHERE status = 2').then(res => {
        return res.map(item => {
            return {
                id: item.city_id,
                name: item.city_name
            };
        });
    });
};

module.exports = {
    get
};

