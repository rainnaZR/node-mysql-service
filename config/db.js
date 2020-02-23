const env = process.env.NODE_ENV || 'localhost';

const mysql = {
    localhost: {
        DATABASE: 'xxx-dev',
        USERNAME: 'xxx-dev',
        PASSWORD: '123!@#qwe',
        HOST: 'xxxx',
        PORT: 3306,
        MUTIPLESTATEMENTS: true,
        insecureAuth: true
    },
    dev: {
        DATABASE: 'xxx-dev',
        USERNAME: 'xxx-dev',
        PASSWORD: '123!@#qwe',
        HOST: 'xxx',
        PORT: 3306,
        MUTIPLESTATEMENTS: true,
        insecureAuth: true
    },
    feature1: {
        DATABASE: 'xxx',
        USERNAME: 'xxx',
        PASSWORD: '123!@#qwe',
        HOST: 'xxx',
        PORT: 3306,
        MUTIPLESTATEMENTS: true,
        insecureAuth: true
    },
    feature2: {
        DATABASE: 'xxx',
        USERNAME: 'xxx',
        PASSWORD: '123!@#qwe',
        HOST: 'xxx',
        PORT: 3306,
        MUTIPLESTATEMENTS: true,
        insecureAuth: true
    },
    alpha: {
        DATABASE: 'xxx',
        USERNAME: 'xxx',
        PASSWORD: '123!@#qwe',
        HOST: 'xxx',
        PORT: 3306,
        MUTIPLESTATEMENTS: true,
        insecureAuth: true
    },
    beta: {
        DATABASE: 'xxx',
        USERNAME: 'xxx',
        PASSWORD: 'wDxF%4Z4Nk94',
        HOST: 'xxx',
        PORT: 3306,
        MUTIPLESTATEMENTS: true,
        insecureAuth: true
    },
    production: {
        DATABASE: 'xxx',
        USERNAME: 'xxx',
        PASSWORD: 'wDxF%4Z4Nk94',
        HOST: 'xxx',
        PORT: 3306,
        MUTIPLESTATEMENTS: true,
        insecureAuth: true
    }
}[env];

const redis = {
    localhost: {
        main: {
            port: 6379,
            host: 'xxx',
            db: 0,
            password: 'Lk%s789$',
            showFriendlyErrorStack: true
        }
    },
    dev: {
        main: {
            port: 6379,
            host: 'xxx',
            db: 1,
            password: 'Lk%s789$',
            showFriendlyErrorStack: true
        }
    },
    alpha: {
        main: {
            port: 6379,
            host: 'xxx',
            db: 0,
            password: 'Lk%s789$',
            showFriendlyErrorStack: true
        }
    },
    feature1: {
        main: {
            port: 6379,
            host: 'xxx',
            db: 6,
            password: 'Lk%s789$',
            showFriendlyErrorStack: true
        }
    },
    beta: {
        main: {
            port: 6379,
            host: 'xxx',
            db: 0,
            password: 'Lk%s789$',
            showFriendlyErrorStack: true
        }
    },
    production: {
        main: {
            port: 6379,
            host: 'xxx',
            db: 0,
            password: 'Lk%s789$',
            showFriendlyErrorStack: true
        }
    }
}[env];

module.exports = {
    mysql,
    redis
};
