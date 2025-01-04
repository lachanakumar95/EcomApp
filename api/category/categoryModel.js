const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    category_name : {
        type: String,
        required: true
    },
    category_desc : String,
    file_name : String,
    file_path : String,
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
},
{
    timestamps : true,
    versionKey: false
});

module.exports = mongoose.model('category', categorySchema);