const jwt = require('jsonwebtoken');
const {encrypt, decrypt} = require('../utils/cryptoAuth');
require('dotenv').config();

const generateAccessToken = (user) => {
    return jwt.sign({ id: encrypt(user._id.toString()), email: encrypt(user.email), role: encrypt(user.role)}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRATION });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ id: encrypt(user._id.toString()), email: encrypt(user.email), role: encrypt(user.role)}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRATION });
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateAccessToken, generateRefreshToken, verifyToken };

