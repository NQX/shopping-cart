const productRoutes = require('./app/routes/productRoutes.js');
const cartRoutes = require('./app/routes/cartRoutes.js');

module.exports = app => {


    app.use("/product", productRoutes);
    app.use('/cart', cartRoutes); 

    //error handling for undefined routes
    app.use((req, res, next) => {
        const error = new Error("Route not found");
        error.status = 404;
        next(error);
    });

    //error handling for everything else. Use only for dev
    app.use((error, req, res, next) => {
        res.status(error.status || 500);
        res.json({
            error: {
                message: error.message
            }
        });
    });
}