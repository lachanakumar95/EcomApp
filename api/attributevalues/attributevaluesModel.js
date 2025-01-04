const mongoose = require('mongoose');
const {Schema} = mongoose;

const attributevalueSchema = new mongoose.Schema({
    attribute_value : {
        type : String,
        required: true
    },
    fk_attribute : {
        type : Schema.Types.ObjectId,
        ref : 'attribute'
    },
    published : {
        type: Boolean,
        default: true
    },
    isActive : {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true,
    versionKey : false
});

module.exports = mongoose.model('attributevalue', attributevalueSchema);