const orderModel = require('../../order/orderModel');
const cartModel = require('../../mobile/cart/cartModel');
const Coupon = require('../../promocodes/promocodeModel');
const Product = require('../../product/productModel');
const taxModel = require('../../tax/taxModel');
const { v4: uuidv4 } = require('uuid'); // Import UUID library


function formatDateToLocaleString(date) {
    return new Date(date).toLocaleString('en-GB', { 
        timeZone: 'Asia/Kolkata', 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true 
    }).replace(' ', ' ');
}


exports.placeOrder = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { paymentMode, couponCode, deliveryAddress, paymentId } = req.body; // Add paymentId to body

        if (!paymentMode) {
            return res.status(400).json({ error: 'Payment mode is required' });
        }

        // Validate delivery address
        if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.postalCode || !deliveryAddress.country) {
            return res.status(400).json({ error: 'Complete delivery address is required' });
        }

        const cart = await cartModel.findOne({ user: userId }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        let orderItems = [];
        let subtotal = 0;
        let totalGST = 0;
        let individualGSTs = [];

        for (const item of cart.items) {
            const product = item.product;
            const variant = product.variants.id(item.variant);
        
            if (!variant || typeof variant.price !== 'number') {
                return res.status(400).json({ error: `Price not found for variant ID ${item.variant}` });
            }
        
            const itemPrice = variant.price * item.quantity;
            subtotal += itemPrice;

            // Calculate GST for each tax applied to the product
            if (product.tax.length > 0) {
                for (let taxItem of product.tax) {
                    const taxResult = await taxModel.findById(taxItem);
                    if (taxResult && taxResult.percentage) {
                        const gstAmount = (itemPrice * taxResult.percentage) / 100;
                        totalGST += gstAmount;

                        individualGSTs.push({
                            taxName: taxResult.name || 'GST',
                            taxPercentage: taxResult.percentage,
                            taxAmount: gstAmount
                        });
                    }
                }
            }
        
            orderItems.push({
                product: product._id,
                variant: variant._id,
                quantity: item.quantity,
                price: itemPrice
            });
        }

        // Apply coupon discount
        let discountAmount = 0;
        if (couponCode) {
            const coupon = await Coupon.findOne({ promocode: couponCode.toLowerCase(), isActive: true, published: true });
            if (coupon) {
                const currentDate = new Date();

                if (currentDate > coupon.expiryDate) {
                    return res.status(400).json({ error: 'Coupon code has expired' });
                }

                if (coupon.usageCount >= coupon.maxUsage) {
                    return res.status(400).json({ error: 'Coupon usage limit has been reached' });
                }

                if (subtotal < coupon.min_order_price) {
                    return res.status(400).json({ error: `Minimum purchase of ${coupon.min_order_price} required for coupon` });
                }

                discountAmount = (subtotal * coupon.discount_percentage) / 100;

                if (coupon.max_discount_price && discountAmount > coupon.max_discount_price) {
                    discountAmount = coupon.max_discount_price;
                }

                coupon.usageCount += 1;
                await coupon.save();
            } else {
                return res.status(400).json({ error: 'Invalid or expired coupon code' });
            }
        }

        const totalAmount = subtotal + totalGST - discountAmount;
        const orderId = `#ORD${uuidv4().slice(0, 8)}`;
        const orderDate = new Date();

        // Validate Payment ID (For Razorpay/Stripe, optional)
        if (paymentMode === 'Online Payment' && !paymentId) {
            return res.status(400).json({ error: 'Payment ID is required for online payments' });
        }

        const order = new orderModel({
            user: userId,
            orderId,
            orderDate,
            items: orderItems,
            paymentMode,
            paymentStatus: paymentMode === 'Online Payment' ? 'Paid' : 'Pending',
            individualGST: individualGSTs,
            subtotal,
            totalAmount,
            discountAmount,
            gstAmount: totalGST,
            deliveryAddress,
            paymentId, // Store payment success ID
            orderStatus: 'Received'
        });

        await order.save();
        await cartModel.findOneAndDelete({ user: userId });

        res.status(200).json({
            message: 'Order placed successfully',
            order,
            subtotal,
            discountAmount,
            totalGST,
            totalAmount
        });
    } catch (err) {
        next(err);
    }
};

exports.getOrderlist = async (req, res, next) => {
    try {
        const orderResult = await orderModel.find().sort({ createdAt: -1 });
        
        const fullResult = orderResult.map((item) => {
            // Calculate total quantity and total price for each order
            const totalQuantity = item.items.reduce((sum, qitem) => sum + qitem.quantity, 0);
            const totalPrice = item.items.reduce((sum, qitem) => sum + qitem.price, 0);
            
            return {
                id: item._id.toString(),
                orderId: item.orderId,
                orderDate: formatDateToLocaleString(item.orderDate),
                totalQuantity,
                totalPrice,
                orderStatus: item.orderStatus
            };
        });
        if(fullResult.length > 0)
        {
            res.status(200).json({ success: true, count: orderResult.length, data: fullResult });
        }
        else
        {
            res.status(200).json({ success: true, count: orderResult.length, data: fullResult, message:'No records found' });
        }
    } catch (err) {
        next(err);
    }
};
