const jwtUtils = require('../utils/userJwt');
const { decrypt } = require('../utils/cryptoAuth');
const userModel = require('../api/user/auth/userModel');
exports.verifyAccessToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Access token required' });

    try {
        const userDetails = jwtUtils.verifyToken(token);
        const user = {
            id: decrypt(userDetails.id),
            name: decrypt(userDetails.name),
            email: decrypt(userDetails.email)
        };
        const check = await userModel.findById(user.id);
        if (token == check.access_token) {
            req.user = user;  // Attaching user to request object
            next();
        }
        else
        {
            return res.status(401).json({success:false, message: 'Invalid or expired token' });
        }

    } catch (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
};
