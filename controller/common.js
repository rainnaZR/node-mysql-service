const {dataFormat} = require('../utils/index');

//成功的响应
const success = (result) => {
    return {
        code: 200,
        msg: 'ok',
        data: dataFormat(result)
    };
};

//失败的响应
const failed = (error) => {
    console.log(error);
    return {
        code: error.status || 500,
        msg: error.message || '服务器异常'
    };
};

module.exports = {
    success,
    failed
};
