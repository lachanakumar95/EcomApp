// Import necessary modules
const path = require('path'); // For handling and transforming file paths
const fs = require('fs'); // For interacting with the file system (creating directories, etc.)
const productModel = require('./productModel'); // To interact with the database model for products
const customError = require('../../utils/customError'); // For custom error handling


// Helper function to move files to a specific folder
const moveFile = async (file, folderName) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg']; // Allowed file types for upload

    // Validate file type
    if (!allowedMimeTypes.includes(file.mimetype)) { 
        throw new Error('Invalid file type. Only JPEG, PNG, and JPG are allowed.'); // If invalid file type, throw an error
    }

    const uniqueName = `${Date.now()}_${file.name}`; // Generate unique file name based on current timestamp
    const filePath = path.join(__dirname, `../../uploads/${folderName}`, uniqueName); // Create full file path

    // Ensure the target folder exists
    if (!fs.existsSync(path.dirname(filePath))) { 
        fs.mkdirSync(path.dirname(filePath), { recursive: true }); // Create directory if it doesn't exist
    }

    await file.mv(filePath); // Move the file to the destination
    return { uniqueName, filePath }; // Return the file name and path
};

//Exiting images remove
const removeFile = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Remove the file if it exists
    }
};

// Main product creation function
exports.createProduct = async (req, res, next) => {
    try {
        const body = req.body; // Get form data from the request
        const files = req.files; // Get uploaded files from the request (assuming express-fileupload)
        // Initialize product data with form values and default empty values if missing
        const productData = {
            product_name: body.product_name || "", 
            fk_category: body.fk_category || null,
            fk_subcategory: body.fk_subcategory || null,
            fk_brand: body.fk_brand || null,
            tags: Array.isArray(body['tags[]']) ? body['tags[]'] : body['tags[]'] ? [body['tags[]']] : [], // Default to an empty array if no value is provided
            product_short_desc: body.product_short_desc || "",
            product_long_desc: body.produt_long_desc || "", // Typo in variable name 'produt_long_desc'
            specification: body.specification || "",
            product_thumbnail: files?.product_thumbnail || null,
            product_desc_images: files['product_desc_images[]'] || [],
            video_provider: body.video_provider || "",
            video_url: body.video_url || "",
            offer_start_date: body.offer_start_date || "",
            offer_end_date: body.offer_end_date || "",
            offer_discount_type: body.offer_discount_type || null,
            offer_discount: body.offer_discount || null,
            flash_sale: body.flash_sale || "",
            min_order_qty: body.min_order_qty || null,
            min_stock_warning: body.min_stock_warning || null,
            tax:  Array.isArray(body['tax[]']) ? body['tax[]'] : body['tax[]'] ? [body['tax[]']] : [], // Default to an empty array if no value is provided
            skuid: body.skuid || "",
            attr_name: Array.isArray(body['attr_name[]']) ? body['attr_name[]'] : [body['attr_name[]']] || [], 
            variants: [], // Placeholder for variants
            shipping_fee_type: body.shipping_fee_type || "",
            shipping_fee: body.shipping_fee || "",
            shipping_days: body.shipping_days || "",
            refundable: body.refundable === "true", // Ensure 'refundable' is a boolean
            featured: body.featured === "true", // Ensure 'featured' is a boolean
            today_deal: body.today_deal === "true", // Ensure 'today_deal' is a boolean
        };



        // Process the variants from the request body
        const variants = [];
        Object.keys(body).forEach((key) => {
            const match = key.match(/^variants\[(\d+)\]\[([a-zA-Z_]+)\](?:\[(.+)\])?$/); // Regular expression to match variant-related fields
            if (match) {
                const variantIndex = parseInt(match[1], 10); // Extract the variant index
                const field = match[2]; // Extract the field name (e.g., 'attributes', 'price')
                const attributeKey = match[3]; // Extract the attribute key (optional)

                if (!variants[variantIndex]) { 
                    variants[variantIndex] = { attributes: {}, images: [] }; // Initialize variant if not already created
                }

                if (field === "attributes" && attributeKey) { // If field is 'attributes' and has attribute key
                    variants[variantIndex].attributes[attributeKey] = body[key]; // Add attribute to the variant
                } else { 
                    variants[variantIndex][field] = body[key]; // Otherwise, set other fields directly
                }
            }
        });

        // Process variant images
        const variantImages = {};
        for (const key of Object.keys(files || {})) { // Loop through all files
            const match = key.match(/^variants\[(\d+)\]\[images\]\[(\d+)\]$/); // Match variant image fields
            if (match) {
                const variantIndex = parseInt(match[1], 10); // Extract the variant index
                const imageIndex = parseInt(match[2], 10); // Extract the image index

                if (!variantImages[variantIndex]) { 
                    variantImages[variantIndex] = []; // Initialize image array for this variant
                }

                if (files[key]) { // If file exists for this image
                    const { uniqueName: imageName, filePath: imagePath } = await moveFile(files[key], 'product/variant_images'); // Move the image file
                    variantImages[variantIndex][imageIndex] = { image_name: imageName, image_path: imagePath }; // Save image details
                }
            }
        }

        // Assign images to corresponding variants
        variants.forEach((variant, index) => {
            if (variantImages[index]) {
                variant.images = variantImages[index]; // Assign variant images to the variant
            }
        });

        productData.variants = variants; // Set the processed variants on the product data

        // Handle the product thumbnail file upload
        if (files?.product_thumbnail) {
            const { uniqueName: thumbnailName, filePath: thumbnailPath } = await moveFile(files.product_thumbnail, 'product/thumbnails'); // Move the thumbnail file
            productData.product_thumbnail_name = thumbnailName; // Save the thumbnail name
            productData.product_thumbnail_path = thumbnailPath; // Save the thumbnail path
        }

        // Handle product description images file upload
        const productDescImages = [];
        if (files['product_desc_images[]']) {
            for (let i = 0; i < files['product_desc_images[]'].length; i++) {
                const { uniqueName: descImageName, filePath: descImagePath } = await moveFile(files['product_desc_images[]'][i], 'product/product_desc_images'); // Move description images
                productDescImages.push({
                    product_desc_images_name: descImageName, // Save image name
                    product_desc_images_path: descImagePath // Save image path
                });
            }
        }
        productData.product_desc_images = productDescImages; // Set the description images on the product data

        // Validation checks for required fields
        if (!productData.product_name) throw customError.BadRequest("Product name is required.");
        if (!productData.fk_category) throw customError.BadRequest("Category is required.");
        if (!productData.product_thumbnail_name) throw customError.BadRequest("Thumbnail is required.");
        if (!productData.skuid) throw customError.BadRequest("SKUID is required.");
        if (productData.variants.length === 0) throw customError.BadRequest("At least one variant is required.");

        // Create the product in the database
        const newProduct = await productModel.create(productData); // Insert product data into the database

        // Return success response
        res.status(201).json({
            success: true,
            message : "Product created successfully"
            //data: newProduct, // Send created product data in response
        });

    } catch (err) {
        next(err); // Pass any error to the error handling middleware
    }
};

/*=========================================
=========== Update the product ==============
============================================*/


exports.updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params; // Get product ID from route params
        const body = req.body; // Form data
        const files = req.files; // Uploaded files
        // Fetch existing product
        const existingProduct = await productModel.findById(id);
        if (!existingProduct) {
            throw customError.NotFound("Product not found.");
        }

        // Update basic product fields
        const updatedData = {
            product_name: body.product_name || existingProduct.product_name,
            fk_category: body.fk_category || existingProduct.fk_category,
            fk_subcategory: body.fk_subcategory || existingProduct.fk_subcategory,
            fk_brand: body.fk_brand || existingProduct.fk_brand,
            tags: Array.isArray(body['tags[]']) ? body['tags[]'] : body['tags[]'] ? [body['tags[]']] : existingProduct.tags, // Default to an empty array if no value is provided
            product_short_desc: body.product_short_desc || existingProduct.product_short_desc,
            product_long_desc: body.product_long_desc || existingProduct.product_long_desc,
            specification: body.specification || existingProduct.specification,
            //product_thumbnail: files?.product_thumbnail || existingProduct.product_thumbnail,
            //product_desc_images: files['product_desc_images[]'] || existingProduct.product_desc_images,
            video_provider: body.video_provider || existingProduct.video_provider,
            video_url: body.video_url || existingProduct.video_url,
            offer_start_date: body.offer_start_date || existingProduct.offer_start_date,
            offer_end_date: body.offer_end_date || existingProduct.offer_end_date,
            offer_discount_type: body.offer_discount_type || existingProduct.offer_discount_type,
            offer_discount: body.offer_discount || existingProduct.offer_discount,
            flash_sale: body.flash_sale || existingProduct.flash_sale,
            min_order_qty: body.min_order_qty || existingProduct.min_order_qty,
            min_stock_warning: body.min_stock_warning || existingProduct.min_stock_warning,
            tax:  Array.isArray(body['tax[]']) ? body['tax[]'] : body['tax[]'] ? [body['tax[]']] : existingProduct.tax, // Default to an empty array if no value is provided
            skuid: body.skuid || existingProduct.skuid,
            attr_name: Array.isArray(body['attr_name[]']) ? body['attr_name[]'] : existingProduct.attr_name,
            shipping_fee_type: body.shipping_fee_type || existingProduct.shipping_fee_type,
            shipping_fee: body.shipping_fee || existingProduct.shipping_fee,
            shipping_days: body.shipping_days || existingProduct.shipping_days,
            refundable: body.refundable !== undefined ? body.refundable === "true" : existingProduct.refundable,
            featured: body.featured !== undefined ? body.featured === "true" : existingProduct.featured,
            today_deal: body.today_deal !== undefined ? body.today_deal === "true" : existingProduct.today_deal,
        };

        // Handle product thumbnail update
        if (files?.product_thumbnail) {
            const { uniqueName: thumbnailName, filePath: thumbnailPath } = await moveFile(
                files.product_thumbnail,
                "product/thumbnails"
            );
            updatedData.product_thumbnail_name = thumbnailName;
            updatedData.product_thumbnail_path = thumbnailPath;
        } else {
            updatedData.product_thumbnail_name = existingProduct.product_thumbnail_name;
            updatedData.product_thumbnail_path = existingProduct.product_thumbnail_path;
        }

/*======================================================
  Product desc images add and remove functionality start
========================================================*/

        // Handle product description images
        let productDescImages = [...existingProduct.product_desc_images];

        // Extract keys that are related to product description images body.product_desc_images
        const bodyDescImageKeys = Object.keys(body).filter((key) => key.startsWith('product_desc_images'));
        // Initialize an array for the images
        let existingDescImages = [];

        // Loop through the keys to extract information
        bodyDescImageKeys.forEach((key) => {
            if (key.includes('product_dec_images')) {
                const index = key.match(/\[(\d+)\]/)[1]; // Extract the index (e.g., 0, 1, etc.)
                // Extract image URL and ID from the corresponding keys
                const imageUrl = body[key]; // Example: body['product_desc_images[0][product_dec_images]']
                const imageName = imageUrl.split('/').pop(); // Get the image file name from URL
                const imageId = body[`product_desc_images[${index}][id]`]; // Example: body['product_desc_images[0][id]']

                // Add the extracted image details to the existingDescImages array
                existingDescImages.push({
                    product_desc_images_name: imageName,
                    product_desc_images_path: imageUrl,
                    id: imageId
                });
            }
        });

        // Identify and remove local files that are no longer referenced
        const filesToRemove = productDescImages.filter(
            (img) => !existingDescImages.some((exImg) => exImg.product_desc_images_name === img.product_desc_images_name)
        );

        // Remove unreferenced files from local storage
        filesToRemove.forEach((file) => {
            removeFile(file.product_desc_images_path);
        });

        // Now filter existing product images and retain only those present in the request
        productDescImages = productDescImages.filter((img) =>
            existingDescImages.some((exImg) => exImg.product_desc_images_name === img.product_desc_images_name)
        );

        // You can also handle new images here, as needed
        // Update the product description images field
        updatedData.product_desc_images = productDescImages;

        // Add new product description images if files are uploaded
        if (files && Object.keys(files).length > 0) {
            // Log and normalize files based on the dynamic keys
            const descImageFiles = Object.keys(files)
                .filter((key) => key.startsWith('product_desc_images')) // Filter keys matching the pattern
                .map((key) => files[key]); // Extract file objects

            if (descImageFiles.length > 0) {
                // Normalize file structure
                const normalizedFiles = Array.isArray(descImageFiles[0])
                    ? descImageFiles.flat()
                    : descImageFiles;

                for (const file of normalizedFiles) {
                    const { uniqueName: descImageName, filePath: descImagePath } = await moveFile(file, 'product/product_desc_images'); // Move description images
                    productDescImages.push({
                        product_desc_images_name: descImageName, // Save image name
                        product_desc_images_path: descImagePath // Save image path
                    });
                }
            }
        }
        // Update the product description images field
        updatedData.product_desc_images = productDescImages;

/*======================================================
  Product desc images add and remove functionality End
========================================================*/
// Prepare variants for update
const updatedVariants = []; // To hold the updated list of variants
const existingVariantsMap = new Map(); // Map existing variants by their ID

// Map existing variants by ID for quick lookup
existingProduct.variants.forEach((variant) => {
    existingVariantsMap.set(variant._id.toString(), variant);
});

// Process incoming variants
Object.keys(body).forEach((key) => {
    const match = key.match(/^variants\[(\d+)\]\[([a-zA-Z_]+)\](?:\[(.+)\])?$/);
    if (match) {
        const variantIndex = parseInt(match[1], 10);
        const field = match[2];
        const attributeKey = match[3];

        if (!updatedVariants[variantIndex]) {
            updatedVariants[variantIndex] = { attributes: {}, images: [] }; // Initialize variant
        }

        if (field === "id") {
            updatedVariants[variantIndex]._id = body[key]; // Preserve ID
        } else if (field === "attributes" && attributeKey) {
            updatedVariants[variantIndex].attributes[attributeKey] = body[key]; // Update attributes
        } else if (field === "images" && attributeKey) {
            // Add image to the images array
            const imageIndex = parseInt(attributeKey, 10);
            updatedVariants[variantIndex].images[imageIndex] = body[key];
        } else {
            updatedVariants[variantIndex][field] = body[key];
        }
    }
});

// Process incoming variant images
const variantImages = {};
for (const key of Object.keys(files || {})) {
    const match = key.match(/^variants\[(\d+)\]\[images\]\[(\d+)\]$/);
    if (match) {
        const variantIndex = parseInt(match[1], 10);
        const imageIndex = parseInt(match[2], 10);

        if (!variantImages[variantIndex]) {
            variantImages[variantIndex] = [];
        }

        if (files[key]) {
            const { uniqueName: imageName, filePath: imagePath } = await moveFile(
                files[key],
                "product/variant_images"
            );
            variantImages[variantIndex][imageIndex] = { image_name: imageName, image_path: imagePath };
        }
    }
}


// // Merge existing variants and new data
// updatedVariants.forEach((variant, index) => {
    
//     const existingVariant = variant._id
//         ? existingVariantsMap.get(variant._id.toString())
//         : null;

//     if (existingVariant) {
//         // Update existing variant
//         variant.attributes = { ...existingVariant.attributes, ...variant.attributes };
//         variant.images = variantImages[index]
//             ? [...existingVariant.images, ...variantImages[index]]
//             : [...existingVariant.images];
//         console.log("Toatal Variant", variant.images);
//     } else {
//         // New variant
//         variant.images = variantImages[index] || [];
//     }
// });

// Handle variant updates and deletions
const localImagePath = path.join(__dirname, '../../uploads/product/variant_images'); // Path to the image directory

// Identify deleted variants
const updatedVariantIds = updatedVariants.map((variant) => variant._id?.toString());
const deletedVariants = Array.from(existingVariantsMap.keys())
    .filter((id) => !updatedVariantIds.includes(id))
    .map((id) => existingVariantsMap.get(id));

// Remove images of deleted variants
deletedVariants.forEach((deletedVariant) => {
    if (deletedVariant && deletedVariant.images) {
        deletedVariant.images.forEach((image) => {
            const imageName = typeof image === 'string' ? image.split('/').pop() : image.image_name;
            const filePath = path.join(localImagePath, imageName);
            removeFile(filePath);
        });
    }
});



    updatedVariants.forEach((variant, index) => {
    const existingVariant = variant._id
        ? existingVariantsMap.get(variant._id.toString())
        : null;

    if (existingVariant) {
        // Update attributes by merging with existing ones
        variant.attributes = { ...existingVariant.attributes, ...variant.attributes };

        // Prepare images: combine existing and new images
        const newVariantImages = variantImages[index] || [];
        const combinedImages = [...(existingVariant.images || []), ...newVariantImages];

        // Extract image names from `variant.images`
        const currentVariantImagesNames = (variant.images || []).map((image) => {
            // Check if image is an object or a string and safely extract the image name
            const imageUrl = image?.image_path || image; // Use image_path if it's an object, or the string itself
            return imageUrl?.split('/').pop(); // Extract the image name safely
        }).filter(Boolean); // Remove any undefined or null values

        // Filter images: keep only those that match current names or are new
        variant.images = combinedImages.filter((variantImage) => {
            // Ensure `variantImage` is valid and has `image_name`
            return (
                variantImage?.image_name &&
                (currentVariantImagesNames.includes(variantImage.image_name) || newVariantImages.includes(variantImage))
            );
        });

         //console.log("Updated Variant Images:", variant.images);

         // Identify files to remove: those not present in `variant.images`
         const updatedImageNames = variant.images.map(image => image.image_name);
         const localImagePath = path.join(__dirname, '../../uploads/product/variant_images'); // Adjust to your image directory path
 
         (existingVariant.images || []).forEach((image) => {
        
             const imageName = typeof image === 'string' ? image.split('/').pop() : image.image_name;
             if (!updatedImageNames.includes(imageName)) {
                 const filePath = path.join(localImagePath, imageName);
                 removeFile(filePath);
             }
         });

    } else {
        // Handle new variants
        variant.images = variantImages[index] || [];
    }
});
// Assign updated variants back to updatedData
updatedData.variants = updatedVariants;

        // Update product in the database
        const updatedProduct = await productModel.findByIdAndUpdate(id, updatedData, { new: true });        

        // Return success response
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct,
        });
    } catch (err) {
        next(err); // Pass error to error-handling middleware
    }
};



/*=========================================
=========== Get Product List ==============
============================================*/
exports.getProductDetails = async (req, res, next)=>{
    try
    {
        const resultProduct = await productModel.find({isActive: true}).sort({createdAt : -1})
        .populate({
            path : 'fk_category',
            match : {isActive: true, published: true},
            select : 'category_name'
        })
        .populate({
            path : 'fk_subcategory',
            match : {isActive: true, published: true},
            select : 'subcategory_name'
        })
        .populate({
            path: 'fk_brand',
            match : {isActive: true, published: true},
            select : 'brand_name'
        });
        const full = resultProduct.map((item) => {
            const product_desc_images = item.product_desc_images.map((productImages)=>{
                return {
                    id: productImages._id,
                    product_dec_images : `${req.protocol}://${req.get('host')}/uploads/product/product_desc_images/${productImages.product_desc_images_name}`
                };
            });
            const variants = item.variants.map((variant) => {
                const images = variant.images.map((image) => {
                    return {
                        id : image._id,
                        image : `${req.protocol}://${req.get('host')}/uploads/product/variant_images/${image.image_name}`,
                    } 
                });
                return { ...variant._doc, images }; // Include transformed images in variant
            });
    
            return {
                ...item._doc, // Spread item data to include product fields
                product_thumbnail_path : `${req.protocol}://${req.get('host')}/uploads/product/thumbnails/${item.product_thumbnail_name}`, 
                product_desc_images,
                variants, // Overwrite variants with modified image URLs
                date : new Date(item.createdAt).toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(',', '')
            };
        });
        if(resultProduct.length > 0)
        {
            res.status(200).json({success: true, count: resultProduct.length, data: full });
        }
        else
        {
            res.status(200).json({success : true, message : 'No records not found'
            });
        }
    }
    catch(err)
    {
        next(err);
    }
}


/*================================
======Product Published ==========
=================================*/
exports.published = async (req, res, next) => {
    try {
        const { id } = req.params;
        const check = await productModel.findById(id);
        if (check) {
            if (check.published) {
                await productModel.findByIdAndUpdate(id, {
                    published: false
                });
                res.status(200).json({ success: true, message: "Product unpublished successfully" });
            }
            else {
                await productModel.findByIdAndUpdate(id, {
                    published: true
                });
                res.status(200).json({ success: true, message: "Product published successfully" });
            }
            
        }
        else {
            res.status(200).json({ success: false, message: "No recods not found" });
        }
    }
    catch (err) {
        next(err);
    }
}

/*=======================================
====== Out of Stock the product==========
=========================================*/


exports.outOfStock = async (req, res, next) => {
    try {
        const { id } = req.params;
        const check = await productModel.findById(id);
        if (check) {
            if (check.out_of_stock) {
                await productModel.findByIdAndUpdate(id, {
                    out_of_stock: false
                });
                res.status(200).json({ success: true, message: "Product have stock successfully" });
                
            }
            else {
                await productModel.findByIdAndUpdate(id, {
                    out_of_stock: true
                });
                res.status(200).json({ success: true, message: "Product out of stock successfully" });  
            }
            
        }
        else {
            res.status(200).json({ success: false, message: "No recods not found" });
        }
    }
    catch (err) {
        next(err);
    }
}