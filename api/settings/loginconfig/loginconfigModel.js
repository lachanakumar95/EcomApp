const mongoose = require('mongoose');

const loginConfigSchema = new mongoose.Schema({
    google_clientId : {
        type : String,
        required : false
    },
    google_clientSecret : {
        type : String,
        required : false
    },
    isActive : {
        type : Boolean,
        default : true,
        required : true
    }
},{
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('loginConfig', loginConfigSchema);