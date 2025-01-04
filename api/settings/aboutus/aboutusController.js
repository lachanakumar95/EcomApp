const customError = require('../../../utils/customError');
const aboutusModel = require('./aboutusModel');

exports.createUpdate = async (req, res, next)=>{
    try
    {
        if(Object.keys(req.body).length === 0) throw customError.BadRequest("Request body cann't be empty");
        const {about_content} = req.body;
        //if(!about_content) throw customError.BadRequest("About us content filed required");
        const checkData = await aboutusModel.find();

        if(checkData.length == 0)
        {
            await aboutusModel.create({
                about_content : about_content
            });
            const result = await aboutusModel.find().select('-createdAt -updatedAt');
            res.status(200).json({success:true, data : result, message : 'Record inserted successfully'});
        }
        else
        {
            await aboutusModel.findByIdAndUpdate(checkData[0]._id.toString(), {
                about_content : about_content
            });
            const result = await aboutusModel.find().select('-createdAt -updatedAt');
            res.status(200).json({success:true, data : result, message : 'Record updated successfully'});
        }
    }
    catch(err)
    {
        next(err);
    }
}

exports.getAboutus = async (req, res, next)=>{
    try
    {
        const result = await aboutusModel.find();
        if(result.length > 0)
        {
            res.status(200).json({success : true, data : result});
        }
        else
        {
            res.status(200).json({success : false, message : 'No records not found'});
        }
    }
    catch(err)
    {
        next(err);
    }
}