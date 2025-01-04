const customError = require("../../utils/customError");
const adminModel = require("./adminModel");
const bcrypt = require('bcryptjs');
const jwtUtils = require('../../utils/adminJwt');
exports.register = async (req, res, next)=>{
    try
    {
        if(Object.keys(req.body).length === 0) throw customError.BadRequest("Request body can'nt be empty");
        const {email, password, role} = req.body;
        if(!email) throw customError.BadRequest('Email filed required');
        if(!password) throw customError.BadRequest("Password filed required");
        //if(!role) throw customError.BadRequest("Role filed required");

        //Already email check
        const emailCheck = await adminModel.findOne({
            email : email
        });
        if(emailCheck)
        {
            return res.status(200).json({success: false, message: "Email already registered"});
        }
        // Insert the new records
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await adminModel.create({
            email: email,
            password: hashedPassword,
            role : role
        });
       
        res.status(201).json({success:true, data : {...req.body}, message : "Record insert successfully"});
    }
    catch(err)
    {
        next(err);
    }
}

exports.login = async(req, res, next)=>{
    try
    {
        if(Object.keys(req.body).length === 0) throw customError.BadRequest("Request body can'nt be empty");
        const {email, password, role} = req.body;
        if(!email) throw customError.BadRequest('Email filed required');
        if(!password) throw customError.BadRequest("Password filed required");

        //Check password
        const adminuser = await adminModel.findOne({
            email : email
        });
        if (!adminuser || !(await bcrypt.compare(password, adminuser.password))) {
            return res.status(201).json({ success: false, message: 'Invalid credentials' });
        }
        const newAccessToken = jwtUtils.generateAccessToken(adminuser);
        const saveToken = await adminModel.findByIdAndUpdate(adminuser._id.toString(), {
            acces_token : newAccessToken
        });
        return res.status(200).json({success: true, token: newAccessToken, message: 'Login successfully'});
    }
    catch(err)
    {
        next(err);
    }
}

exports.forgetPassword = async (req, res, next)=>{
    try
    {
        if(Object.keys(req.body).length === 0) throw customError.BadRequest("Request body can'nt be empty");
        const {email, password, role} = req.body;
        if(!email) throw customError.BadRequest('Email filed required');
        if(!password) throw customError.BadRequest("Password filed required");
        //Check Email
        const checkemail = await adminModel.findOne({
            email : email
        });
        if(checkemail)
        {
            const hashedPassword = await bcrypt.hash(password, 10);
            await adminModel.findByIdAndUpdate(checkemail._id.toString(), {
                password : hashedPassword
            });

            return res.status(200).json({success : true, message : "Password changed successfully"});
        }
        else
        {
            return res.status(200).json({success : false, message: "Invalid email address"});
        }
    }
    catch(err)
    {
        next(err);
    }
}