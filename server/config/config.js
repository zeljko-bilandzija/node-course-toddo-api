const env = process.env.NODE_ENV ||'development'; // po default lokalno je undefined

if (env === 'development' || env === 'test') {
    const config = require('./config.json');
    const envConfig = config[env];
    // Object.keys lista [ 'PORT', 'MONGODB_URI' ]
    Object.keys(envConfig).forEach(key => {
        process.env[key] = envConfig[key]
    });
}