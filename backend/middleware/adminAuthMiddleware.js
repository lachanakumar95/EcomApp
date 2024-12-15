const jwtUtils = require('../utils/adminJwt');
const {encrypt, decrypt} = require('../utils/cryptoAuth');
const adminModel = require('../api/admin/adminModel');

exports.verifyAccessToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({success:false, message: 'Access token required' });

    try {
        const userdetails = jwtUtils.verifyToken(token);
        const user = {
            id : decrypt(userdetails.id),
            email : decrypt(userdetails.email),
            role : decrypt(userdetails.role)
        }
        const check = await adminModel.findOne({
            email : decrypt(userdetails.email)
        });
        if(token == check.acces_token)
        {
            req.user = user;  // Attaching user to request object
            next();
        }
        else
        {
            return res.status(401).json({success:false, message: 'Invalid or expired token' });
        }
       
    } catch (err) {
        res.status(403).json({ success:false, message: 'Invalid or expired token' });
    }
};
