const productRoutes = require('./app/productRoutes.js');

module.exports = app => {

    
    app.use("/product", productRoutes);
}