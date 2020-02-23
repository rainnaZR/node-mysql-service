module.exports = {
    apps: [{
        name: 'node-mysql-service',
        script: './index.js',
        exec_mode: 'cluster',
        instances: 1,
        watch: false,
        cwd: '/data/server/xxx',
        max_memory_restart: '500M',
        log_date_format: "YYYY-MM-DD HH:mm:ss",
        env_localhost: {
            NODE_ENV: 'localhost'
        },
        env_dev: {
            NODE_ENV: 'dev'
        },
        env_alpha: {
            NODE_ENV: 'alpha'
        },
        env_feature1: {
            NODE_ENV: 'feature1'
        },
        env_feature2: {
            NODE_ENV: 'feature2'
        },
        env_beta: {
            NODE_ENV: 'beta'
        },
        env_product_vpc: {
            NODE_ENV: 'production'
        }
    }]
};
