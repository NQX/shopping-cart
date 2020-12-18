const mongoose = require('mongoose');

module.exports =  app => {
    mongoose.connect(process.env.DB_CONNECTION, {
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
