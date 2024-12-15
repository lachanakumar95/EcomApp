const mongoose = require('mongoose');
const contactinfoSchema = new mongoose.Schema({
    contact_email : String,
    contact_no : String,
    facebook_link : String,
    instagram_link : String,
    google_plus_link : String,
    twitter_link : String,
    youtube_link : String
},
{
    timestamps : true,
    versionKey: false
});

module.exports = mongoose.model('contactinfo', contactinfoSchema);