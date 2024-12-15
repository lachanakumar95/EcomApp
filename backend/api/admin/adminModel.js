const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    email : {
        type: String,
        required : true,
        unique : true
    },
    password : {
        type: String,
        required : true
    },
    role: {
        type: String,
        enum : ['admin', 'staff'],
        default: 'staff'
    },
    acces_token: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true,
    versionKey: false
}
);

module.exports = mongoose.model('admin', adminSchema);