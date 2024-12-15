const mongoose = require('mongoose');
const generalInfoSchema = new mongoose.Schema({
    site_name : String,
    footer_copywrite : String,
    currency_symboll : {
        type : String,
        default : '₹'
    },
    company_color: String,
    file_name : String,
    file_path: String
},
{
    timestamps: true,
    versionKey: false
}
);

module.exports = mongoose.model('generalinformation', generalInfoSchema);