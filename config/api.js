const env = process.env.NODE_ENV || 'localhost';

const server = {
    "production": "https://xxx.com",
    "beta": "https://xxx.com",
    "feature1": "http://xxx.com",
    "feature2": "http://xxx.com",
    "alpha": "http://xxx.com",
    "dev": "http://xxx.com",
    "localhost": "http://xxx.com"
}[env];

module.exports = {
    server
};
