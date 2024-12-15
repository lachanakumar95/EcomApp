const customError = require('../../../utils/customError');
const loginConfigModel = require('./loginconfigModel');

exports.createLoginConfig = async (req, res, next) => {
    try {
        if (Object.keys(req.body).length === 0) throw customError.BadRequest("Request body cann't be empty");
        const { google_clientID, google_clientSecret } = req.body;
        console.log(req.body);
        // if (!google_clientID) throw customError.BadRequest("Google clientID filed required");
        // if (!google_clientSecret) throw customError.BadRequest("Google clientSecret filed required");
        const checkData = await loginConfigModel.find();
        if(checkData.length == 0)
        {
            await loginConfigModel.create({
                google_clientId: google_clientID,
                google_clientSecret: google_clientSecret
            });
        }
        else {
            await loginConfigModel.findByIdAndUpdate(checkData[0]._id.toString(), {
                google_clientId: google_clientID,
                google_clientSecret: google_clientSecret
            });
        }
        res.status(200).json({ success: true, data: {...req.body}, message: "Record inserted successfully" });
    }
    catch (err) {
        next(err);
    }
}
exports.getLoginConfig = async (req, res, next)=>{
    try
    {
        const result = await loginConfigModel.find();
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