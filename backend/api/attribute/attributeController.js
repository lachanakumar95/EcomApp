const customError = require('../../utils/customError');
const attributeModel = require('./attributeModel');

exports.createAttribute = async (req, res, next)=>{
    try
    {
        if (Object.keys(req.body).length === 0) throw customError.BadRequest("Request body cann't be empty");
        const {attribute_name} = req.body;
        if(!attribute_name) throw customError.BadRequest("Attribute name filed required");
        await attributeModel.create({
            attribute_name: attribute_name
        });
        res.status(200).json({success: true, Attribute: attribute_name, message: 'Attribute inserted successfully'});
    }
    catch(err)
    {
        next(err);
    }
}

exports.editAttribute = async (req, res, next)=>{
    try
    {
        if (Object.keys(req.body).length === 0) throw customError.BadRequest("Request body cann't be empty");
        const {id} = req.params;
        const {attribute_name} = req.body;
        if(!attribute_name) throw customError.BadRequest("Attribute name filed required");
        await attributeModel.findByIdAndUpdate(id, {
            attribute_name: attribute_name
        });
        res.status(200).json({success: true, Attribute: attribute_name, message: 'Attribute updated successfully'});
    }
    catch(err)
    {
        next(err);
    }
}

exports.deleteAttribute = async (req, res, next)=>{
    try
    {
        const {id} = req.params;
        const deleteRecords = await attributeModel.findByIdAndUpdate(id, {
            isActive: false
        });
        if (deleteRecords) {
            res.status(200).json({ success: true, message: "Record deleted successfully" });
        }
        else {
            res.status(200).json({ success: false, message: "No records found" });
        }
    }
    catch(err)
    {
        next(err);
    }

}

exports.getAttribute = async (req, res, next)=>{
    try
    {
        const result = await attributeModel.find({isActive: true}).select('-updatedAt -createdAt').sort({createdAt : -1});
        const fullRecord = result.map((item)=>{
            return {
                id : item._id,
                attribute_name : item.attribute_name,
                published : item.published,
                isActive : item.isActive
            }
        });
        if(result)
        {
            res.status(200).json({success: true, count:fullRecord.length, data: fullRecord});
        }
        else {
            res.status(200).json({ success: false, message: "No records found" });
        }

    }
    catch(err)
    {
        next(err);
    }
}

//Admin panel attribute
exports.getAttributePublished = async (req, res, next)=>{
    try
    {
        const result = await attributeModel.find(
            {
                isActive: true,
                published : true
            }
        ).select('-updatedAt -createdAt').sort({createdAt : -1});
        const fullRecord = result.map((item)=>{
            return {
                id : item._id,
                attribute_name : item.attribute_name,
                published : item.published,
                isActive : item.isActive
            }
        });
        if(result)
        {
            res.status(200).json({success: true, count:fullRecord.length, data: fullRecord});
        }
        else {
            res.status(200).json({ success: false, message: "No records found" });
        }

    }
    catch(err)
    {
        next(err);
    }
}

exports.published = async (req, res, next) => {
    try {
        const { id } = req.params;
        const check = await attributeModel.findByIdAndUpdate(id);
        if (check) {
            if (check.published) {
                await attributeModel.findByIdAndUpdate(id, {
                    published: false
                });
                res.status(200).json({ success: true, message: "Attribute unpublished successfully" });
            }
            else {
                await attributeModel.findByIdAndUpdate(id, {
                    published: true
                });
                res.status(200).json({ success: true, message: "Attribute published successfully" });
            }
            
        }
        else {
            res.status(200).json({ success: false, message: "No recods not found" });
        }
    }
    catch (err) {
        next(err);
    }
}
