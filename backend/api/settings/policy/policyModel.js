const mongoose = require('mongoose');
const policySchema = new mongoose.Schema({
    terms_condition :{
        type : String,
        required: true
    },
    shipping_policy : {
        type : String,
        required: true
    },
    privacy_policy : {
        type : String,
        required: true
    },
    return_policy : {
        type: String,
        required : true
    }
},
{
    timestamps: true,
    versionKey: false
}
);

module.exports = mongoose.model('policymanagement', policySchema);