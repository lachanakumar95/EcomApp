const CryptoJS = require('crypto-js');
// Secret key for encryption (should be kept safe)
const SECRET_KEY = 'Iamkingofecommerceapp@852456159';  // Replace with your own key

// Function to encrypt text
function encrypt(text) {
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
}

// Function to decrypt text
function decrypt(ciphertext) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}

module.exports = {encrypt, decrypt}
