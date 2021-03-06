const cartRepository = require('../repository/cartRepository.js');
const productRepository = require('../repository/productRepository.js');


exports.addItemToCart = async (req, res) => {
    const productId = req.body.productId;
    const quantity = parseInt(req.body.quantity);

    try {
        let cart = await cartRepository.cart();
        let productDetails = await productRepository.productById(productId);
        
        if (!productDetails) {
            return res.status(500).json({
                type: "Not Found",
                msg: "Invalid request"
            });
        }

        //if no cart exists, create a new one and add items
        if(!cart) {
            const cartData = {
                items: [{
                    productId: productId,
                    quantity: quantity,
                    total: parseInt(productDetails.price * quantity),
                    price: productDetails.price
                }],
                subTotal: parseInt(productDetails.price * quantity)
            }
            cart = await cartRepository.addItem(cartData)
            res.json(cart);
            return;
        }

        //If cart exists 
        //Check if index exists
        const indexFound = cart.items.findIndex(item => item.productId.id == productId);
        //This removes an item from the the cart if the quantity is set to 0, we can use this method to remove an item from the cart
        if (indexFound !== -1 && quantity <= 0) {
            cart.items.splice(indexFound, 1);
            if (cart.items.length == 0) {
                cart.subTotal = 0;
            } else {
                cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
            }
        }
        //Check if product exist, just add the previous quantity with the new quantity and update the total price
        else if (indexFound !== -1) {
            cart.items[indexFound].quantity = cart.items[indexFound].quantity + quantity;
            cart.items[indexFound].total = cart.items[indexFound].quantity * productDetails.price;
            cart.items[indexFound].price = productDetails.price
            cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
        }
        //Check if quantity is greater than 0 then add item to items array
        else if (quantity > 0) {
            cart.items.push({
                productId: productId,
                quantity: quantity,
                price: productDetails.price,
                total: parseInt(productDetails.price * quantity)
            });
            cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
        }
        //If quantity of price is 0 throw the error
        else {
            return res.status(400).json({
                type: "Invalid",
                msg: "Invalid request"
            })
        }
        let data = await cart.save();
        res.status(200).json({
            type: "success",
            mgs: "Process Successful",
            data: data
        });
    
        //This creates a new cart and then adds the item to the cart that has been created
       
    } catch (err) {
        console.log(err);
        res.status(400).json({
            type: "Invalid",
            msg: "Something Went Wrong",
            err: err
        });
    }
}


exports.getCart = async (req, res) => {
    try {
        let cart = await cartRepository.cart()
        if (!cart) {
            return res.status(400).json({
                type: "Invalid",
                msg: "Cart not found",
            })
        }
        res.status(200).json({
            status: true,
            data: cart
        })
    } catch (err) {
        console.log(err);
        res.status(400).json({
            type: "Invalid",
            msg: "Something went wrong",
            err: err
        });
    }
}


exports.emptyCart = async (req, res) => {
    try {
        let cart = await cartRepository.cart();
        cart.items = [];
        cart.discountInEuro = 0;
        cart.discountPercentage = 0;
        cart.subTotal = 0;
        let data = await cart.save();
        res.status(200).json({
            type: "Success",
            mgs: "Cart has been emptied",
            data: data
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            type: "Invalid",
            msg: "Something went wrong",
            err: err
        });
    }
}

exports.removeItem = async (req, res) => {
    try {
        let cart = await cartRepository.cart();
        
        const indexFound = cart.items.findIndex(item => String(item.productId.id) == req.params.id)
        if(indexFound === -1) {
           throw new Error('index of item to remove not found')
        }

        const item = cart.items[indexFound]
        const price = item.price;

        //if more than 1 item of same kind in cart, reduce quantity
        if(item.quantity > 1) {
            item.quantity--;
            item.total -= price;
        } else {
            cart.items.splice(indexFound, 1)
        }

        cart.subTotal -= price;

        //if cart empty, remove completely 
        if(cart.items.length === 0) {
            console.log('empty now')
            cart.items = [];
            cart.subTotal = 0
        }
            
        await cart.save();

        res.status(200).json({
            type: "Success",
            mgs: "Item has been removed",
            data: item
        });
    } catch(err) {
        console.log(err);
        res.status(400).json({
            type: "Invalid",
            msg: "Something went wrong",
            err: err
        });
    }
}


exports.applyDiscount = async (req, res) => {
    try {
        let cart = await cartRepository.cart();
        const discountPercentage = req.body.discountPercentage ? Number.parseInt(req.body.discountPercentage) : 0;
        const discountInEuro = req.body.discountInEuro ? Number.parseFloat(req.body.discountInEuro) : 0;

        if(discountPercentage != 0 && discountPercentage <= 100 && discountPercentage >= 0) {
            cart.subTotal -= cart.subTotal / 100 * discountPercentage;
            cart.discountPercentage = discountPercentage;
        }

        if(discountInEuro != 0 && discountInEuro >= 0) {
            cart.subTotal = cart.subTotal - discountInEuro;
            cart.discountInEuro = discountInEuro;
        }
        
        let data = await cart.save();
        res.status(200).json({
            type: "success",
            mgs: "Discount applied successfully",
            data: data
        });

    } catch (err) {
        console.log(err);
        res.status(400).json({
            type: "Invalid",
            msg: "Something went wrong",
            err: err
        });
    }
}