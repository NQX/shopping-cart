const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let ItemSchema = new Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
    quantity: {
        type: Number,
        default: 1,
        min: [1, 'Qunatity can not be less then 1.']
    },
    price: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    }
});


const CartSchema = new Schema({
    items: [ItemSchema],
    discountInEuro: {
        type: Number,
        default: 0
    },
    discountPercentage: {
        type: Number,
        default: 0
    },
    subTotal: {
        default: 0,
        type: Number
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Cart', CartSchema);