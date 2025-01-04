const mongoose = require('mongoose');
const {Schema} = mongoose;

const addressSchema = new mongoose.Schema({
    fk_user : {
        type : Schema.Types.ObjectId,
        ref : 'user'
    },
    house_no :{
        type : String,
        required: true
    },
    street :{
        type : String,
        required: true
    },
    city : {
        type : String,
        required : true,
    },
    state : {
        type : String,
        required: true
    },
    landmark : {
        type: String,
        required: true
    },
    country : {
        type : String,
        required: true
    },
    pincode : {
        type : Number,
        required: true
    },
    address_type : {
        type : String,
        enum : ["Home","Office","Other"],
        default : "Home"
    },
    set_default : {
        type : Boolean,
    }
},{
    timestamps : true,
    versionKey : false
});

module.exports = mongoose.model('address', addressSchema);