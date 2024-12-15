const mongoose = require('mongoose');
const metadataSchema = new mongoose.Schema({
    meta_title : String,
    meta_description : String
},
{
    timestamps: true,
    versionKey: false
}
);
module.exports = mongoose.model('metadata', metadataSchema);