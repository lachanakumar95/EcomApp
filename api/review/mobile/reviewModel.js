const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new mongoose.Schema({
    fk_user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    fk_product: {
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        trim: true,
        maxlength: 100
    },
    comment: {
        type: String,
        trim: true,
        maxlength: 1000
    },
},{
    timestamps : true,
    versionKey: false
});

module.exports = mongoose.model('review', reviewSchema);