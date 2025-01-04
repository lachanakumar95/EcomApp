const customError = require('../../../utils/customError');
const userModel = require('./userModel');
const bcrypt = require('bcryptjs');
const userJwt = require('../../../utils/userJwt');

exports.register = async (req, res, next) => {
    try {
        if (Object.keys(req.body).length === 0) throw customError.BadRequest("Request body cann't be empty");
        const { name, email, phoneno, password } = req.body;
        if (!name) throw customError.BadRequest("Name filed required");
        if (!email) throw customError.BadRequest("Email filed required");
        if (!phoneno) throw customError.BadRequest("Phone number filed required");
        if (!password) throw customError.BadRequest("Password filed required");
        const emailCheck = await userModel.findOne({ email: email });
        const phoneCheck = await userModel.findOne({ phone: phoneno });
        if (emailCheck) {
            return res.status(200).json({ success: true, message: "Email addess already taken." });
        }
        if (phoneCheck) {
            return res.status(200).json({ success: true, message: "Phone number already used." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await userModel.create({
            name: name,
            email: email,
            phone: phoneno,
            password: hashedPassword
        });
        res.status(200).json({ success: true, data: { ...req.body }, message: "Register Successfully" });
    }
    catch (err) {
        next(err);
    }
}

exports.login = async (req, res, next)=>{
    try
    {
        if(Object.keys(req.body).length === 0) throw customError.BadRequest("Request body cann't be empty");
        const{email, password} = req.body;
        if (!email) throw customError.BadRequest("Email filed required");
        if (!password) throw customError.BadRequest("Password filed required");
        const result = await userModel.findOne({email : email});
        if (!result || !(await bcrypt.compare(password, result.password))) {
            return res.status(200).json({ message: 'Invalid credentials' });
        }
        const userDetails = {
            id: result._id.toString(),
            name: result.name,
            email: result.email,
          }
        const accessToken = userJwt.generateAccessToken(userDetails);
        await userModel.findByIdAndUpdate(result._id.toString(), {
            access_token : accessToken
        });
        res.status(200).json({success : true, message : "Successfully logged in", token : accessToken});
    }
    catch(err)
    {
        next(err);
    }
}

exports.forgetPassword = async (req, res, next)=>{
    try
    {
        if(Object.keys(req.body).length === 0) throw customError.BadRequest("Request body cann't be empty");
        const {email, new_password, confirm_password} = req.body;
        if(!email) throw customError.BadRequest("Email addess filed required");
        const emailCheck = await userModel.findOne({email : email});
        if(emailCheck.googleId) return res.status(200).json({success:true, message : "Google login email address, So cann't change password"});
        if(emailCheck)
        {
            if(!new_password) throw customError.BadRequest("New password filed required");
            if(!confirm_password) throw customError.BadRequest("Confirm password filed required");
            if(new_password === confirm_password)
            {
                const passwordHash = await bcrypt.hash(confirm_password, 10);
                await userModel.findByIdAndUpdate(emailCheck._id.toString(), {
                    password : passwordHash
                });
                return res.status(200).json({success : true, message : "Password updated successfully"});
            }
            else
            {
                return res.status(200).json({success: true, message : "Password mismatch"});
            }
        }
        else
        {
            return res.status(200).json({ success: true, message: "Invalid email address" });
        }
    }
    catch(err)
    {
        next(err);
    }
}

