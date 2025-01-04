const mongoose = require('mongoose');
const taxSchema = new mongoose.Schema({
    tax_type : {
        type : String,
        required : true
    },
    percentage : {
        type : Number,
        required : true
    },
    published : {
        type : Boolean,
        required: true,
        default : true
    }
}, {
    timestamps : true,
    versionKey : false
});

module.exports = mongoose.model('tax', taxSchema);