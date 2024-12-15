const mongoose = require('mongoose');
const { Schema } = mongoose;

const imageSchema = new mongoose.Schema({
    image_name: {
        type: String
    },
    image_path: {
        type: String
    }
}, { _id: true });

const variantSchema = new mongoose.Schema({
    attributes:{
        type : Object,
        default : {}
    },
    price: {
        type: Number,
        required: true
    },
    selling_price: {
        type: Number,
        required: false
    },
    stock: {
        type: Number,
        required: true
    },
    images: {
        type: [imageSchema],
        required: true
    }
    // videos: {
    //     type: String
    // },
    // out_of_stock : {
    //     type : Boolean,
    //     required : true,
    //     default : false
    // },
}, { _id: true });

const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    fk_category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    fk_subcategory: {
        type: Schema.Types.ObjectId,
        ref: 'subcategory',
        required: false
    },
    fk_brand: {
        type: Schema.Types.ObjectId,
        ref: 'brand',
        required: false
    },
    tags: {
        type: [String],
        default: []
    },
    product_short_desc: {
        type: String,
        required: false
    },
    product_long_desc: {
        type: String,
        required: false
    },
    specification: {
        type: String,
        required: false
    },
    product_thumbnail_name: {
        type: String,
        required : true
    },
    product_thumbnail_path: {
        type: String,
        required: true
    },
    product_desc_images :{
        type: [
            {
                product_desc_images_name :{
                    type : String
                },
                product_desc_images_path : {
                    type : String
                }
            }
        ],
        default: []
    },
    video_provider : String,
    video_url : String,
    offer_start_date: { type: Date },
    offer_end_date: { type: Date },
    offer_discount_type: String,
    offer_discount : Number,
    flash_sale : String,
    min_order_qty : Number,
    min_stock_warning : Number,
    tax : {
        type: [String],
        default: []
    },
    skuid: {
        type: String,
        required: true,
        default: ''
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    // attr_name : [
    //     {
    //         id: { type: String, required: true },
    //         attribute_name: { type: String, required: true },
    //         published: { type: Boolean, default: false },
    //         isActive: { type: Boolean, default: false },
    //     }
    // ],
    attr_name : {
        type : [String],
        default : []
    },
    variants: {
        type: [variantSchema],
        required: true,
        default: []
    },
    shipping_fee_type : String,
    shipping_fee : Number,
    shipping_days : String,
    refundable : Boolean,
    featured : Boolean,
    today_deal : Boolean,
    out_of_stock : {
        type : Boolean,
        required : true,
        default : false
    },
    published : {
        type : Boolean,
        required : true,
        default : true
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('product', productSchema);