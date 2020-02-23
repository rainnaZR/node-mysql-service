const axios = require('axios');
const qs = require('querystring');
const { ACCOUNT_ROLE, ACCOUNT_LIST } = require('../../service/constants');

const { server } = require('../../config');

// 逻辑参考 mgr 登录
function login(args) {
    const { username, password } = args;

    const url = `${server}/mgrLogin`;
    const options = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    };
    const data = qs.stringify({ username, password, accountType: 1 });

    return axios.post(url, data, options)
        .then(res => {
            const { status, data = {} } = res;

            if (status !== 200) {
                throw new Error('登录接口调用错误');
            }

            const { success, payload, msg } = data;
            // 保存该账号对应的角色权限
            payload && payload.user && (payload.user.lbAcountRole = getAcountRole(payload.user));

            if (success) return {
                ...payload,
                token: payload.COOKIE_USER_KEY
            };
            throw new Error(msg);
        });
}

// 获取账号的角色权限
function getAcountRole(user = {}){
    if(!user || !user.username) return ACCOUNT_ROLE.INVALID;

    const userName = user.username;
    // 管理员角色
    if(ACCOUNT_LIST.OWNERS.includes(userName)){
        return ACCOUNT_ROLE.OWNER;
    }
    // 开发者角色
    if(ACCOUNT_LIST.DEVELOPERS.includes(userName)){
        return ACCOUNT_ROLE.DEVELOPER;
    }
    // 运营角色
    return ACCOUNT_ROLE.OPERATIONER;
}

module.exports = {
    login
};
