const mongoose = require('mongoose');

module.exports =  app => {
    //mongoose.connect('mongodb://localhost:27017/cart', {
    mongoose.connect('mongodb+srv://nqx:NQXisthe%2321@cluster0-4z3yb.mongodb.net/test?retryWrites=true&w=majority', {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
    })
    .then(res => console.log('db connected'))
    .catch(err => console.log(err));

    mongoose.Promise = global.Promise;
    process.on("SIGINT", cleanup);
    process.on("SIGTERM", cleanup);
    process.on("SIGUP", cleanup);


    if(app) {
        app.set("mongoose", mongoose);
    }
}

function cleanup() {
    mongoose.connection.close(() => {
        process.exit(0);
    });
}
