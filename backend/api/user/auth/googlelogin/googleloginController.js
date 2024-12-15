const passport = require('passport');
const userModel = require('../userModel');
const userJwt = require('../../../../utils/userJwt');
exports.googleLogin = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleCallback = passport.authenticate('google', { failureRedirect: '/' });

exports.googleCallbackRedirect = async (req, res) => {
  // After successful login, send a JSON response or redirect to a front-end route
  if(req.user)
  {
    const { name, _id, email, profilePicture } = req.user;
    const userDetails = {
      id: _id.toString(),
      name: name,
      email: email,
      //profile: profilePicture,
    }
    const accessToken = userJwt.generateAccessToken(userDetails);
    const saveToken = await userModel.findByIdAndUpdate(_id.toString(), {
      access_token: accessToken
    });
  
    res.json({
      success: true,
      message: 'Successfully logged in',
      token: accessToken, // Send the user info in JSON format
    });
  }

};

exports.logout = (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out successfully' });
  });
};
