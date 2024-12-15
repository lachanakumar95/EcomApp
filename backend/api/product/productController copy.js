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

// Main product creation function
exports.createProduct = async (req, res, next) => {
    try {
        const body = req.body; // Get form data from the request
        const files = req.files; // Get uploaded files from the request (assuming express-fileupload)
        console.log(body);
        // Initialize product data with form values and default empty values if missing
        const productData = {
            product_name: body.product_name || "", 
            fk_category: body.fk_category || null,
            fk_subcategory: body.fk_subcategory || null,
            fk_brand: body.fk_brand || null,
            tags: Array.isArray(body['tags[]']) ? body['tags[]'] : [], // Ensure tags is an array
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
            tax: body.tax || "",
            skuid: body.skuid || "",
            attr_name : Array.isArray(body['attr_name[]']) ? body['attr_name[]'] : [], // Ensure tags is an array
            variants: [], // Placeholder for variants
            shipping_fee_type: body.shipping_fee_type || "",
            shipping_fee: body.shipping_fee || "",
            shipping_days: body.shipping_days || "",
            refundable: body.refundable === "true", // Ensure 'refundable' is a boolean
            featured: body.featured === "true", // Ensure 'featured' is a boolean
            today_deal: body.today_deal === "true", // Ensure 'today_deal' is a boolean
        };


        // Process attr_name fields
        const attributes = [];
        Object.keys(body).forEach((key) => {
            const match = key.match(/^attr_name\[(\d+)\]\[([a-zA-Z_]+)\]$/); // Regular expression to match attr_name fields
            if (match) {
                const index = parseInt(match[1], 10); // Extract attribute index
                const field = match[2]; // Extract field name (e.g., 'id', 'attribute_name', etc.)

                if (!attributes[index]) {
                    attributes[index] = {}; // Initialize attribute object if not already created
                }

                attributes[index][field] = body[key]; // Set field value
            }
        });

        productData.attr_name = attributes; // Assign parsed attributes to the product data


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