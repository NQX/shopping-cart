const router = require('express').Router();
const cartController = require('../controller/cartController.js');

router.post('/', cartController.addItemToCart);

router.get('/', cartController.getCart);

router.post('/discount', cartController.applyDiscount);

router.delete('/empty-cart', cartController.emptyCart);

router.delete('/:id', cartController.removeItem);


module.exports = router;