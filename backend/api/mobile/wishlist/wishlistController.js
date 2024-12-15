const wishlistModel = require('./wishlistModel');
const productModel = require('../../product/productModel');
const customError = require('../../../utils/customError');

exports.addToWishlist = async (req, res, next) => {
    try {
        if(Object.keys(req.body).length === 0) throw customError.BadRequest("Request body cann't be empty");
        const {productId } = req.body;
        if(!productId) throw customError.BadRequest("ProductId filed required");
        const userId = req.user.id;
        let wishlist = await wishlistModel.findOne({ user: userId });
        if (!wishlist) {
            wishlist = new wishlistModel({ user: userId, products: [] });
        }

        if (!wishlist.products.includes(productId)) {
            wishlist.products.push(productId);
        }

        await wishlist.save();
        res.status(200).json({success:true, count: wishlist.products.length, wishlist, message: 'Product added to wishlist', });
    } catch (err) {
        next(err);
    }
};

exports.removeFromWishlist = async (req, res, next) => {
    try {
        if (Object.keys(req.body).length === 0) throw customError.BadRequest("Request body can't be empty");
        const { productId } = req.body;
        if (!productId) throw customError.BadRequest("ProductId field required");

        const userId = req.user.id;
        const wishlist = await wishlistModel.findOne({ user: userId });
        if (!wishlist) {
            return res.status(404).json({ success: false, message: 'Wishlist not found' });
        }

        // Check if the product exists in the wishlist and remove it
        const productIndex = wishlist.products.indexOf(productId);
        if (productIndex !== -1) {
            wishlist.products.splice(productIndex, 1);
            await wishlist.save();
        } else {
            return res.status(404).json({ success: false, message: 'Product not found in wishlist' });
        }

        res.status(200).json({ success: true, count: wishlist.products.length, wishlist, message: 'Product removed from wishlist' });
    } catch (err) {
        next(err);
    }
};

exports.getWishlist = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Fetch the wishlist and populate product details
        const wishlist = await wishlistModel.findOne({ user: userId })
            .populate({
                path: 'products',
                match : {isActive : true}
            })
            .lean();

        if (!wishlist || wishlist.products.length === 
            
            0) {
            return res.status(200).json({ success: true, message: 'Wishlist is empty', wishlist: [] });
        }

        // Map through products to include the product thumbnail URL
        const productsWithDetails = wishlist.products.map((item) => {
            const variants = item.variants.map((variant) => {
                const images = variant.images.map((image) => {
                    return `${req.protocol}://${req.get('host')}/uploads/product/${image.image_name}`;
                });
                return { ...variant, images }; // Include transformed images in variant
            });
            return {
                ...item, // Spread item data to include product fields
                thumbnail: `${req.protocol}://${req.get('host')}/uploads/product/${item.thumbnail_name}`,
                variants, // Overwrite variants with modified image URLs
            }
          
        });

        res.status(200).json({
            success: true,
            count: productsWithDetails.length,
            wishlist: productsWithDetails,
            message: 'Wishlist retrieved successfully'
        });
    } catch (err) {
        next(err);
    }
};
