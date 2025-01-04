const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name : {
        type: String
    },
    email : {
        type : String,
        unique : true,
        required : true
    },
    password : {
        type : String
    },
    googleId : {
        type: String
    },
    profilePicture : String,
    file_name : String,
    file_path : String,
    gender : {
        type : String,
        enum : ["Male", "Female", "Other"]
    },
    dob : Date,
    phone : {
        type : String,
    },
    access_token : String,
    isActive : {
        type : Boolean,
        default : true,
        required: true
    }
},{
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('user', userSchema);