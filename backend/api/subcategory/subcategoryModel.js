const mongoose = require('mongoose');
const {Schema} = mongoose;

const subcategorySchema = new mongoose.Schema({
    subcategory_name: {
        type: String,
        required: true
    },
    file_name : String,
    file_path : String,
    fk_category : {
        type : Schema.Types.ObjectId,
        ref : 'category'
    },
    home_display : {
        type: Boolean,
        default: false
    },
    published : {
        type: Boolean,
        default: true
    },
    isActive : {
        type: Boolean,
        default : true
    }
},{
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('subcategory', subcategorySchema);