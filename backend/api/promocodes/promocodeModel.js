const mongoose = require('mongoose');
const promocodeSchema = new mongoose.Schema({
    promocode: { 
        type: String, 
        required: true, 
        unique: true 
    },
    discount_percentage: { 
        type: Number, 
        required: true 
    },
    min_order_price: { 
        type: Number, 
        required: true 
    },
    max_discount_price: { type: Number },
    usageCount: { type: Number, default: 0 },
    maxUsage: { type: Number, required: true },
    expiryDate: { type: Date, required: true }, // Add expiry date
    description : {type : String},
    published : {
        type : Boolean,
        required : true,
        default : true
    },
    isActive : {
        type : Boolean,
        required: true,
        default : true
    }
}, {
    timestamps : true,
    versionKey: false
});

module.exports = mongoose.model('promocode', promocodeSchema);