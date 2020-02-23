const city = require('./city/index');
const module_ = require('./module/index');
const page = require('./page/index');
const build = require('./build/index');
const login = require('./login/index');
const importData = require('./import/index');
const tools = require('./tools/index');

module.exports = [
    ...city,
    ...module_,
    ...page,
    ...build,
    ...login,
    ...importData,
    ...tools
];
