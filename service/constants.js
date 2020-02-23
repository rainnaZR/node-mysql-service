const CONSTANTS = {
    PAGE_STATUS: {
        NORMAL: 1,
        INVALID: 2
    },
    PAGE_CITY_STATUS: {
        PUBLISHED: 1,
        SAVED: 2,
        INVALID: 3
    },
    PAGE_MODULE_STATUS: {
        NORMAL: 1,
        INVALID: 2
    },
    IMPORT_DATA_STATUS: {
        NORMAL: 1,
        INVALID: 2
    },
    PAGE_TYPE: {
        DEFAULT: 0,
        CITY_PAGE: 1,
        COUNTRY_PAGE: 2,
        TEMPLATE: 3
    },
    ACCOUNT_ROLE: {
        INVALID: 0,
        OWNER: 1, // 管理员
        DEVELOPER: 2, // 开发者
        OPERATIONER: 3  // 运营
    },
    ACCOUNT_LIST: {
        OWNERS: ['1885816817'],
        DEVELOPERS: ['1885816867']
    }
};

module.exports = CONSTANTS;
