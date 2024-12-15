const mongoose = require('mongoose');
const {Schema} = mongoose;

const cartItemSchema = new Schema({
    product: { 
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: true 
    },
    variant: {
        type: Schema.Types.ObjectId,
        required: true
    },
    quantity: { 
        type: Number, 
        required: true, 
        default: 1 
    }
}, {_id : false});

const cartSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'user', 
        required: true 
    },
    items: [cartItemSchema],
},{
    timestamps : true,
    versionKey : false
});

module.exports = mongoose.model('Cart', cartSchema);