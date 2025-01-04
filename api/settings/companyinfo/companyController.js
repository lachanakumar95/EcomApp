const companyinfoModel = require('./companyinfoModel');
const customError = require('../../../utils/customError');

exports.createUpdateRecords = async (req, res, next)=>{
    try
    {
        if(Object.keys(req.body).length === 0) throw customError.BadRequest("Request body cann't be empty");
        const {company_name, GST_register_no, mobile, email, address } = req.body;
        //if(!company_name || !GST_register_no || !GST_percentage || !mobile || !email || !address) throw customError.BadRequest("company_name, GST_register_no, GST_no, mobile, email, address fileds are required"); 
        
        const checkData = await companyinfoModel.find();
        if(checkData.length == 0)
        {
            await companyinfoModel.create({
                company_name : company_name,
                GST_register_no : GST_register_no,
                //GST_percentage : GST_percentage,
                mobile : mobile,
                email : email,
                address : address
            });
            const result = await companyinfoModel.findOne().select('-createdAt -updatedAt');
            res.status(200).json({success : true, data : result, message : "Record inserted successfully"});
        }
        else
        {
            await companyinfoModel.findByIdAndUpdate(checkData[0]._id.toString(), {
                company_name : company_name,
                GST_register_no : GST_register_no,
                //GST_percentage : GST_percentage,
                mobile : mobile,
                email : email,
                address : address
            });
            const result = await companyinfoModel.findOne().select('-createdAt -updatedAt');
            res.status(200).json({success : true, data : result, message : "Record updated successfully"});
        }
       
    }
    catch(err)
    {
        next(err);
    }
}

exports.getCompanyInfo = async (req, res, next)=>{
    try
    {
        const result = await companyinfoModel.find();
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