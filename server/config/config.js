const env = process.env.NODE_ENV ||'development'; // po default lokalno je undefined

if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://cigara9393:Daniel01!@127.0.0.1:27017/TodoApp?authSource=admin';
} else if (env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://cigara9393:Daniel01!@127.0.0.1:27017/TodoAppTest?authSource=admin';
}