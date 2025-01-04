    const cartModel = require('./cartModel');
    const productModel = require('../../product/productModel');
    const customError = require('../../../utils/customError');

    exports.addToCart = async (req, res, next) => {
        try {
            const { productId, variantId, quantity } = req.body;

            if (!productId) throw customError.BadRequest("ProductID filed required");
            if (!variantId) throw customError.BadRequest("variantId filed required");
            if (!quantity) throw customError.BadRequest("quantity filed required");

            const userId = req.user.id;

            // Check if the product and specified variant exist in the database
            const product = await productModel.findById(productId);
            if (!product) {
                return res.status(404).json({success: false, message: 'Product not found' });
            }
            // Get product model variant value
            const variant = product.variants.id(variantId);
            if (!variant) {
                return res.status(404).json({ success: false, message: 'Variant not found' });
            }
             // Check if the requested quantity is available in stock
            if (quantity > variant.stock) {
                return res.status(400).json({ success: false, message: `Only ${variant.stock} units available in stock` });
            }
            // Fetch or create the user's cart
            let cart = await cartModel.findOne({ user: userId });
            if (!cart) {
                cart = new cartModel({ user: userId, items: [] });
            }


            // Find if the product with specified variant is already in the cart
            const existingItem = cart.items.find(item => 
                item.product.toString() === productId && item.variant.toString() === variantId
            );
            
            if (existingItem) {
                // Update quantity if product and variant already exist in cart
                existingItem.quantity = quantity;

                // If quantity becomes zero or less, remove the item from the cart
                if (existingItem.quantity <= 0) {
                    cart.items = cart.items.filter(item =>
                        !(item.product.toString() === productId && item.variant.toString() === variantId)
                    );
                }
            } else {
                // Add new item to cart if it does not exist
                if (quantity > 0) {
                    cart.items.push({ product: productId, variant: variantId, quantity });
                } else {
                    return res.status(400).json({ success: false, message: 'Quantity should be at least 1 to add to cart' });
                }
            }

            // Calculate total amount for the cart
            let totalAmount = 0;

            for (const item of cart.items) {
                // Fetch the product based on product ID in the cart item
                const product = await productModel.findById(item.product);
                if (product) {
                    // Find the correct variant in the product's variants array
                    const variant = product.variants.find(v => v._id.toString() === item.variant.toString());

                    // Calculate the amount for the item if the variant exists
                    if (variant) {
                        totalAmount += variant.price * item.quantity;
                    }
                }
            }

            await cart.save();


            // Send back the updated cart details
            res.status(200).json({
                success : true,
                count : cart.items.length,
                cart: {
                    items: cart.items,
                    totalAmount: totalAmount
                },
                message: 'Cart updated successfully'
            });
        } catch (err) {
            next(err);
            // console.error(error);
            // res.status(500).json({ error: 'Failed to update cart' });
        }
    };

    exports.removeFromCart = async (req, res, next) => {
        try {
            const { productId, variantId } = req.body;
    
            if (!productId) throw customError.BadRequest("ProductID field required");
            if (!variantId) throw customError.BadRequest("variantId field required");
    
            const userId = req.user.id;
    
            // Fetch the user's cart
            let cart = await cartModel.findOne({ user: userId });
            if (!cart) {
                return res.status(404).json({ error: 'Cart not found' });
            }
    
            // Find and remove the item with specified product and variant
            const itemIndex = cart.items.findIndex(item =>
                item.product.toString() === productId && item.variant.toString() === variantId
            );
    
            if (itemIndex === -1) {
                return res.status(404).json({success: false, message: 'Item not found in cart' });
            }
    
            // Remove item from cart items array
            cart.items.splice(itemIndex, 1);
    
            // Calculate the updated total amount for the cart
            let totalAmount = 0;
            for (const item of cart.items) {
                const product = await productModel.findById(item.product);
                if (product) {
                    const variant = product.variants.find(v => v._id.toString() === item.variant.toString());
                    if (variant) {
                        totalAmount += variant.price * item.quantity;
                    }
                }
            }
    
            await cart.save();
    
            // Send back the updated cart details
            res.status(200).json({
                success : true,
                count : cart.items,
                cart: {
                    items: cart.items,
                    totalAmount: totalAmount
                },
                message: 'Item removed from cart successfully'
            });
        } catch (err) {
            next(err);
        }
    };
    
    exports.getCart = async (req, res, next) => {
        try {
            const userId = req.user.id;
    
            // Fetch the user's cart
            const cart = await cartModel.findOne({ user: userId }).lean();
            if (!cart || cart.items.length === 0) {
                return res.status(200).json({ message: 'Cart is empty', cart: { items: [], totalAmount: 0 } });
            }
    
            let totalAmount = 0;
            const cartItems = [];
    
            // Iterate over each item in the cart and populate product details
            for (const item of cart.items) {
                const product = await productModel.findById(item.product).lean();
                if (!product) continue;
    
                // Find the correct variant in the product's variants array
                const variant = product.variants.find(v => v._id.toString() === item.variant.toString());

                if (!variant) continue;
    
                // Calculate item total and accumulate to total amount
                const itemTotal = variant.price * item.quantity;
                totalAmount += itemTotal;
    
                // Add the item with product and variant details to the cartItems array
                cartItems.push({
                    product : {
                        productId: product._id,
                        product_name : product.product_name,
                        product_short_dec : product.product_short_desc,
                        thumbnail: `${req.protocol}://${req.get('host')}/uploads/product/${product.thumbnail_name}`,
                    },
                    variant : {
                        variantId : variant._id,
                        variant_name : variant.attributes_name,
                        variant_value : variant.attributes_value,
                        variantImage: `${req.protocol}://${req.get('host')}/uploads/product/${variant.images[0].image_name}`
                    },

                    price: variant.price,
                    selling_price : variant.selling_price,
                    quantity: item.quantity,
                    itemTotal: itemTotal,
                   
                  
                });
            }
    
            // Send the response with cart items and total amount
            res.status(200).json({
               success : true,
               count : cartItems.length,
                cart: {
                    items: cartItems,
                    totalAmount: totalAmount
                },
                message: 'Cart retrieved successfully',
            });
        } catch (err) {
            next(err);
        }
    };
    
    