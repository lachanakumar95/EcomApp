const attributevaluesModel = require('./attributevaluesModel');
const customError = require("../../utils/customError");

exports.createAttributevalue = async (req, res, next) => {
    try {
        if (Object.keys(req.body).length === 0) throw customError.BadRequest("Request body cann't be empty");
        const { attribute_value, attributename } = req.body;
        if (!attribute_value) throw customError.BadRequest("Attribute value filed required");
        if (!attributename) throw customError.BadRequest("Attribute name key filed required");

        await attributevaluesModel.create({
            attribute_value: attribute_value,
            fk_attribute: attributename
        });
        res.status(200).json({ success: true, attrubute_value: attribute_value, message: "Attribute value inserted successfully" })
    }
    catch (err) {
        next(err);
    }
}
exports.editAttributevalue = async (req, res, next) => {
    try {
        if (Object.keys(req.body).length === 0) throw customError.BadRequest("Request body cann't be empty");
        const { attribute_value, attributename } = req.body;
        if (!attribute_value) throw customError.BadRequest("Attribute value filed required");
        if (!attributename) throw customError.BadRequest("Attribute name key filed required");
        const { id } = req.params;
        await attributevaluesModel.findByIdAndUpdate(id, {
            attribute_value: attribute_value,
            fk_attribute: attributename
        });
        res.status(200).json({ success: true, attrubute_value: attribute_value, message: "Attribute value updated successfully" })
    }
    catch (err) {
        next(err);
    }
}

exports.deleteAttributevalues = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleteRecords = await attributevaluesModel.findByIdAndUpdate(id, {
            isActive: false
        });
        if (deleteRecords) {
            res.status(200).json({ success: true, message: "Record deleted successfully" });
        }
        else {
            res.status(200).json({ success: false, message: "No records found" });
        }
    }
    catch (err) {
        next(err);
    }

}

exports.getAllAttributevalues = async (req, res, next) => {
    try {
        const result = await attributevaluesModel.find({
            isActive: true,
        }).populate({
            path: 'fk_attribute',
            match: { isActive: true, published: true },
            select: ('_id attribute_name')
        }).select('-updatedAt -createdAt').sort({ createdAt: -1 });
        if (result) {
            // Filter out items where fk_attribute is null
            const full = result
                .filter(item => item.fk_attribute !== null)
                .map(item => ({
                    id: item._id,
                    attribute_value: item.attribute_value,
                    fk_attribute: item.fk_attribute,
                    published: item.published,
                    isActive: item.isActive,
                }));
            res.status(200).json({ success: true, count: full.length, data: full });
        }
        else {
            res.status(200).json({ success: false, message: "No records found" });
        }

    }
    catch (err) {
        next(err);
    }
}

exports.getAttributevalues = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await attributevaluesModel.find({
            fk_attribute: id,
            isActive: true
        })
            .populate({
                path: 'fk_attribute',
                match: { isActive: true, published: true },
                select: ('_id attribute_name')
            })
            .select('-updatedAt -createdAt').sort({ createdAt: -1 });
        if (result) {
            // Filter out items where fk_attribute is null
            const full = result
                .filter(item => item.fk_attribute !== null) //Skip the null values
                .map(item => ({
                    id: item._id,
                    attribute_value: item.attribute_value,
                    fk_attribute: item.fk_attribute,
                    published: item.published,
                    isActive: item.isActive,
                }));
            res.status(200).json({ success: true, count: full.length, data: full });
        }
        else {
            res.status(200).json({ success: false, message: "No records found" });
        }

    }
    catch (err) {
        next(err);
    }
}


exports.getAttributevaluesPublished = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await attributevaluesModel.find({
            fk_attribute: id,
            isActive: true,
            published: true
        })
            .populate({
                path: 'fk_attribute',
                match: { isActive: true, published: true },
                select: ('_id attribute_name')
            })
            .select('-updatedAt -createdAt').sort({ createdAt: -1 });
        if (result) {
            // Filter out items where fk_attribute is null
            const full = result
                .filter(item => item.fk_attribute !== null) //Skip the null values
                .map(item => ({
                    id: item._id,
                    attribute_value: item.attribute_value,
                    fk_attribute: item.fk_attribute,
                    published: item.published,
                    isActive: item.isActive,
                }));
            res.status(200).json({ success: true, count: full.length, data: full });
        }
        else {
            res.status(200).json({ success: false, message: "No records found" });
        }

    }
    catch (err) {
        next(err);
    }
}

exports.published = async (req, res, next) => {
    try {
        const { id } = req.params;
        const check = await attributevaluesModel.findByIdAndUpdate(id);
        if (check) {
            if (check.published) {
                await attributevaluesModel.findByIdAndUpdate(id, {
                    published: false
                });
                res.status(200).json({ success: true, message: "Attribute value unpublished successfully" });
            }
            else {
                await attributevaluesModel.findByIdAndUpdate(id, {
                    published: true
                });
                res.status(200).json({ success: true, message: "Attribute value published successfully" });
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