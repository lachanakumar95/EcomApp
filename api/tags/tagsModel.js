const mongoose = require('mongoose');

const tagsSchema = new mongoose.Schema({
    tag_name : {
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

module.exports = mongoose.model("tag", tagsSchema);