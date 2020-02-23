const {mysql, redis} = require('./db');
const { server } = require('./api');

const config = {
    // 启动端口
    port: 3000,

    // 数据库配置
    database: mysql,

    redis,

    server
};

module.exports = config;
