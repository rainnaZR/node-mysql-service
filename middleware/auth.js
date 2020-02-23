const axios = require('axios');
const qs = require('querystring');
const { failed } = require('../controller/common');
const { server } = require('../config');
const debug = require('debug')('auth');

const noAuthPaths = [
    '/json',
    '/login',
    '/page/preview'
];

// 验证 token
module.exports = function() {
    return async function(ctx, next) {
        // 登录接口和开发用请求例外
        if (noAuthPaths.includes(ctx.path)) {
            return await next();
        }

        const token = ctx.headers.authorization || ctx.headers.Authorization;
        const url = `${server}/token/verify`;
        debug('验证token url:' + url);
        const options = {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        };
        const query = qs.stringify({ token });

        if (!token) {
            ctx.user = null;

            return ctx.body = failed({
                status: 401,
                message: '用户未登录'
            });
        }

        const res = await axios.post(url, query, options);
        const { status, data = {} } = res;

        if (status !== 200) {
            return ctx.body = failed({});
        }

        const { success, payload, msg } = data;

        if (!success) {
            ctx.user = null;

            return ctx.body = failed({
                status: 401,
                message: msg
            });
        }

        ctx.user = {
            userId: payload.userId,
            username: payload.username,
            realname: payload.realname
        };

        debug('ctx.user:' + JSON.stringify(ctx.user));

        await next();
    };
};
