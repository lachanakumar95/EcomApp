const contactinfoModel = require('./contactinfoModel');
const customError = require('../../../utils/customError');
exports.createUpdateRecords = async (req, res, next)=>{
    try
    {
        if(Object.keys(req.body).length === 0) throw customError.BadRequest("Request body cann't be empty");
        const {contact_email, contact_no, facebook_link, instagram_link, google_plus_link, twitter_link, youtube_link} = req.body;
       // if(!contact_email || !contact_no) throw customError.BadRequest("contact_email, contact_no fileds are required"); 
        
        const checkData = await contactinfoModel.find();
        if(checkData.length == 0)
        {
            await contactinfoModel.create({
                contact_email : contact_email,
                contact_no : contact_no,
                facebook_link : facebook_link,
                instagram_link : instagram_link,
                google_plus_link : google_plus_link,
                twitter_link : twitter_link,
                youtube_link : youtube_link,
            });
            const result = await contactinfoModel.findOne().select('-createdAt -updatedAt');
            res.status(200).json({success : true, data : result, message : "Record inserted successfully"});
        }
        else
        {
            await contactinfoModel.findByIdAndUpdate(checkData[0]._id.toString(), {
                contact_email : contact_email,
                contact_no : contact_no,
                facebook_link : facebook_link,
                instagram_link : instagram_link,
                google_plus_link : google_plus_link,
                twitter_link : twitter_link,
                youtube_link : youtube_link,
            });
            const result = await contactinfoModel.findOne().select('-createdAt -updatedAt');
            res.status(200).json({success : true, data : result, message : "Record updated successfully"});
        }
    }
    catch(err)
    {
        next(err);
    }
}

exports.getContactus = async (req, res, next)=>{
    try
    {
        const result = await contactinfoModel.find();
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