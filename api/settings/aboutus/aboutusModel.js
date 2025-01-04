const mongoose = require('mongoose');

const aboutusSchema = new mongoose.Schema({
    about_content : {
        type: String,
        required: true
    },
    file_name: String,
    file_path: String
},
{
    timestamps: true,
    versionKey: false
}
);

module.exports = mongoose.model('aboutinfo', aboutusSchema);