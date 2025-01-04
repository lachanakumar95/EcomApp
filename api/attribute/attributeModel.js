const mongoose = require('mongoose');

const attributeSchema = new mongoose.Schema({
    attribute_name : String,
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

module.exports = mongoose.model('attribute', attributeSchema);