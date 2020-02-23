const Redis = require('ioredis');
const { redis: redisConfig } = require('../config');
const debug = require('debug')('db');

/**
 * 获取对应城市redis，用完之后记得 disconnect()
 * @param {number} cityId
 */
function getRedis(cityId) {
    return new Promise((resolve) => {
        const config = redisConfig[cityId] || redisConfig.main;
        const client = new Redis(config);
        client.on('ready', () => {
            debug(`redis for ${cityId} connected.`);
            resolve(client);
        });
    });
}

function disconnectRedis(redisClient) {
    if (redisClient instanceof Redis) {
        redisClient.disconnect();
    }
}

module.exports = {
    redisConfig,
    getRedis,
    disconnectRedis
};
