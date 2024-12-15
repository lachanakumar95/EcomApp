const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId,
        ref: 'user', 
        required: true 
    },
    orderId : {
        type: String,
        required: true
    },
    orderDate :{
        type : Date,
        required : true
    },
    items: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'product', required: true },
            variant: { type: Schema.Types.ObjectId, ref: 'product.variants', required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    deliveryAddress: { 
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    subtotal :{
        type : Number,
        required : true
    },
    discountAmount:{
        type: Number, 
        required: true 
    },
    gstAmount:{
        type: Number, 
        required: true 
    },
    totalAmount: { 
        type: Number, 
        required: true 
    },
    paymentStatus: { 
        type: String, 
        enum: ['Pending', 'Paid'], 
        default: 'Pending' 
    },
    paymentMode: { 
        type: String, 
        enum: ['Credit Card', 'Debit Card', 'Cash on Delivery', 'UPI', 'Net Banking', 'Online Payment'], 
        required: true 
    },
    orderStatus: { 
        type: String, 
        enum: ['Received', 'Processed', 'Shipped', 'Delivered'], default: 'Received' 
    }
},{
    timestamps : true,
    versionKey : false,
});

module.exports = mongoose.model('Order', orderSchema);
