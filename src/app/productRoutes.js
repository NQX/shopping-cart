const router = require('express').Router();
const productController = require("./controller.js");
const multerInstance = require('./multer.js');
//const multer = require('multer');



router.post('/', multerInstance.upload.single('image'),
    productController.createProduct);


router.get('/', (req, res) => res.send('hello'));


router.get('/:id', productController.getProductById);

router.delete('/:id', productController.removeProduct);


module.exports = router;