const mongoose = require('mongoose');

const companyinfoSchema = new mongoose.Schema({
    company_name : {
        type: String,
        required: false
    },
    GST_register_no : {
        type : String,
        required: false
    },
    // GST_percentage : {
    //     type: String,
    //     required: false
    // },
    mobile : String,
    email : {
        type: String,
        unique: false
    },
    address : String
},
{
    timestamps : true,
    versionKey: false
});

module.exports = mongoose.model('companyinfo', companyinfoSchema);