const jwt = require('jsonwebtoken');
require('dotenv').config();
const {encrypt} = require('./cryptoAuth');
const generateAccessToken = (user) => {
    return jwt.sign({ id: encrypt(user.id), name: encrypt(user.name), email: encrypt(user.email) }, process.env.USER_JWT_SECRET, { expiresIn: process.env.USER_JWT_ACCESS_EXPIRATION });
};

const generateRefreshToken = (user) => {
    return jwt.sign({  id: encrypt(user.id), name: encrypt(user.name), email: encrypt(user.email)  }, process.env.USER_JWT_SECRET, { expiresIn: process.env.USER_JWT_REFRESH_EXPIRATION });
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.USER_JWT_SECRET);
};

module.exports = { generateAccessToken, generateRefreshToken, verifyToken };
