const metadataModel = require('./metadataModel');
const customError = require('../../../utils/customError');
exports.createUpdateRecords = async (req, res, next)=>{
    try
    {
        if(Object.keys(req.body).length === 0) throw customError.BadRequest("Request body cann't be empty");
        const {meta_title, meta_description} = req.body;
        //if(!meta_title || !meta_description) throw customError.BadRequest("meta_title, meta_description fileds are required"); 
        
        const checkData = await metadataModel.find();
        if(checkData.length == 0)
        {
            await metadataModel.create({
                meta_title : meta_title,
                meta_description : meta_description
            });
            const result = await metadataModel.findOne().select('-createdAt -updatedAt');
            res.status(200).json({success : true, data : result, message : "Record inserted successfully"});
        }
        else
        {
            await metadataModel.findByIdAndUpdate(checkData[0]._id.toString(), {
                meta_title : meta_title,
                meta_description : meta_description
            });
            const result = await metadataModel.findOne().select('-createdAt -updatedAt');
            res.status(200).json({success : true, data : result, message : "Record updated successfully"});
        }
       
    }
    catch(err)
    {
        next(err);
    }
}

exports.getMetaContent = async (req, res, next)=>{
    try
    {
        const result = await metadataModel.find();
        if(result.length > 0)
        {
            res.status(200).json({success: true, data : result});
        }
        else
        {
            res.status(200).json({success: false, message : "No record not found"});
        }
    }
    catch(err)
    {
        next(err);
    }
}