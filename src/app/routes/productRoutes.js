const router = require('express').Router();
const productController = require("../controller/productController.js");
const multerInstance = require('../../config/multer.js');
//const multer = require('multer');



router.post('/', multerInstance.upload.single('image'), productController.createProduct);

router.get('/', productController.getProducts)

router.get('/:id', productController.getProductById);

router.delete('/:id', productController.removeProduct);


module.exports = router;