const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    productId: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: [true, "Please include the product name"]
    },
    price: {
        type: String,
        required: [true, "Please include product price"]
    },
    image: {
        type: String,
        required: true
    }

});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;