const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    file_name : String,
    file_path : String,
    published : {
        type: Boolean,
        default: true
    },
    isActive : {
        type: Boolean,
        default : true
    }
},
{
    timestamps:true,
    versionKey: false
}
);

module.exports = mongoose.model("banner", bannerSchema);