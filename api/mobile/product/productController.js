const productModel = require('../../product/productModel');
const reviewModel = require('../../review/mobile/reviewModel');
const wishlistModel = require('../wishlist/wishlistModel');

function formatDateToLocaleString(date) {
    return new Date(date).toLocaleString('en-GB', { 
        timeZone: 'Asia/Kolkata', 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric', 
        // hour: '2-digit', 
        // minute: '2-digit', 
        // second: '2-digit', 
        // hour12: false 
    }).replace(' ', ' ');
}

exports.getCategoryProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const reviewResult = await reviewModel.find()
        .populate({
            path: 'fk_product',
            select: '_id'
        })
        .populate({
            path: 'fk_user',
            select: '_id name createdAt'
        });
        const wishlistResult = await wishlistModel.find();
        const resultProduct = await productModel.find({
            isActive: true, $or: [
                { fk_category: id },
                { fk_subcategory: id }
            ]
        }).sort({ createdAt: -1 })
            .populate({
                path: 'fk_category',
                match: { isActive: true, published: true },
                select: 'category_name'
            })
            .populate({
                path: 'fk_subcategory',
                match: { isActive: true, published: true },
                select: 'subcategory_name'
            })
            .populate({
                path: 'fk_brand',
                match: { isActive: true, published: true },
                select: 'brand_name'
            });
        const full = resultProduct.map((item) => {
            const variants = item.variants.map((variant) => {
                const images = variant.images.map((image) => {
                    return `${req.protocol}://${req.get('host')}/uploads/product/${image.image_name}`;
                });
                return { ...variant._doc, images }; // Include transformed images in variant
            });

             // Check if the product is in any user's wishlist
             const isInWishlist = wishlistResult.some(wishlist => 
                wishlist.products.includes(item._id.toString())
            );
            return {
                ...item._doc, // Spread item data to include product fields
                thumbnail: `${req.protocol}://${req.get('host')}/uploads/product/${item.thumbnail_name}`,
                variants, // Overwrite variants with modified image URLs
                review: reviewResult
                .filter(ritem => ritem.fk_product && ritem.fk_product._id.toString() === item._id.toString())
                .map(reviewitem => ({
                    name : reviewitem.fk_user.name,
                    rating: reviewitem.rating,
                    title: reviewitem.title,
                    comment: reviewitem.comment,
                    date :formatDateToLocaleString(reviewitem.fk_user.createdAt)
                })),
                isInWishlist,
                date: new Date(item.createdAt).toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(',', '')
            };
        });
        if (resultProduct.length > 0) {
            res.status(200).json({ success: true, count: resultProduct.length, data: full });
        }
        else {
            res.status(200).json({
                success: true, count: resultProduct.length, data: full, message: 'No records not found'
            });
        }
    }
    catch (err) {
        next(err);
    }
}
exports.getProductDetails = async (req, res, next) => {
    try {
        const reviewResult = await reviewModel.find()
            .populate({
                path: 'fk_product',
                select: '_id'
            })
            .populate({
                path: 'fk_user',
                select: '_id name createdAt'
            });
        const wishlistResult = await wishlistModel.find();
        const resultProduct = await productModel.find({ isActive: true }).sort({ createdAt: -1 })
            .populate({
                path: 'fk_category',
                match: { isActive: true, published: true },
                select: 'category_name'
            })
            .populate({
                path: 'fk_subcategory',
                match: { isActive: true, published: true },
                select: 'subcategory_name'
            })
            .populate({
                path: 'fk_brand',
                match: { isActive: true, published: true },
                select: 'brand_name'
            });

        const full = resultProduct.map((item) => {
            const variants = item.variants.map((variant) => {
                const images = variant.images.map((image) => {
                    return `${req.protocol}://${req.get('host')}/uploads/product/${image.image_name}`;
                });
                return { ...variant._doc, images }; // Include transformed images in variant
            });
              // Check if the product is in any user's wishlist
              const isInWishlist = wishlistResult.some(wishlist => 
                wishlist.products.includes(item._id.toString())
            );
            return {
                ...item._doc, // Spread item data to include product fields
                thumbnail: `${req.protocol}://${req.get('host')}/uploads/product/${item.thumbnail_name}`,
                variants, // Overwrite variants with modified image URLs
                review: reviewResult
                    .filter(ritem => ritem.fk_product && ritem.fk_product._id.toString() === item._id.toString())
                    .map(reviewitem => ({
                        name : reviewitem.fk_user.name,
                        rating: reviewitem.rating,
                        title: reviewitem.title,
                        comment: reviewitem.comment,
                        date :formatDateToLocaleString(reviewitem.fk_user.createdAt)
                    })),
                isInWishlist,
                date: new Date(item.createdAt).toLocaleString('en-GB', {
                    timeZone: 'Asia/Kolkata',
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                }).replace(',', '')
            };
        });
        if (resultProduct.length > 0) {
            res.status(200).json({ success: true, count: resultProduct.length, data: full });
        }
        else {
            res.status(200).json({
                success: true, message: 'No records not found'
            });
        }
    }
    catch (err) {
        next(err);
    }
}
exports.getSingleProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const reviewResult = await reviewModel.find()
        .populate({
            path: 'fk_product',
            select: '_id'
        })
        .populate({
            path: 'fk_user',
            select: '_id name createdAt'
        });
        const wishlistResult = await wishlistModel.find();
        const resultProduct = await productModel.find({
            isActive: true, _id: id
        }).sort({ createdAt: -1 })
            .populate({
                path: 'fk_category',
                match: { isActive: true, published: true },
                select: 'category_name'
            })
            .populate({
                path: 'fk_subcategory',
                match: { isActive: true, published: true },
                select: 'subcategory_name'
            })
            .populate({
                path: 'fk_brand',
                match: { isActive: true, published: true },
                select: 'brand_name'
            });
        const full = resultProduct.map((item) => {
            const variants = item.variants.map((variant) => {
                const images = variant.images.map((image) => {
                    return `${req.protocol}://${req.get('host')}/uploads/product/${image.image_name}`;
                });
                return { ...variant._doc, images }; // Include transformed images in variant
            });

            // Check if the product is in any user's wishlist
            const isInWishlist = wishlistResult.some(wishlist => 
                wishlist.products.includes(item._id.toString())
            );

            return {
                ...item._doc, // Spread item data to include product fields
                thumbnail: `${req.protocol}://${req.get('host')}/uploads/product/${item.thumbnail_name}`,
                variants, // Overwrite variants with modified image URLs
                review: reviewResult
                .filter(ritem => ritem.fk_product && ritem.fk_product._id.toString() === item._id.toString())
                .map(reviewitem => ({
                    name : reviewitem.fk_user.name,
                    rating: reviewitem.rating,
                    title: reviewitem.title,
                    comment: reviewitem.comment,
                    date :formatDateToLocaleString(reviewitem.fk_user.createdAt)
                })),
                isInWishlist,
                date: new Date(item.createdAt).toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(',', '')
            };
        });
        if (resultProduct.length > 0) {
            res.status(200).json({ success: true, count: resultProduct.length, data: full });
        }
        else {
            res.status(200).json({
                success: true, count: resultProduct.length, data: full, message: 'No records not found'
            });
        }
    }
    catch (err) {
        next(err);
    }
}