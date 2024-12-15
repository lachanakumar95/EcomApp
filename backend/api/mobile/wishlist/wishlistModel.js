const mongoose = require('mongoose');
const{Schema} = mongoose;
const whishlistSchema = new mongoose.Schema({
    user: { 
        type: Schema.Types.ObjectId,
        ref: 'user', 
        required: true 
    },
    products: [{ type: Schema.Types.ObjectId, ref: 'product' }]
},{
    timestamps : true,
    versionKey : false
});

module.exports = mongoose.model('whislist', whishlistSchema);