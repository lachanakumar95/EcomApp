const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../api/user/auth/userModel');
const loginConfigModel = require('../api/settings/loginconfig/loginconfigModel');
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);  // Use async/await here instead of callback
    if (user) {
      done(null, user);
    } else {
      done(new Error("User not found"), null);
    }
  } catch (err) {
    done(err, null);
  }
});


let loginConfigData = null;

// Fetch login config data and initialize Google Strategy
loginConfigModel.findOne()
  .then((result) => {
    loginConfigData = result;
    console.log(loginConfigData.google_clientId);

    // Initialize Google Strategy once config data is loaded
    passport.use(new GoogleStrategy({ 
     clientID: loginConfigData.google_clientId,
      clientSecret: loginConfigData.google_clientSecret,
      callbackURL: '/api/google/callback'
    },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });
          if (!user) {
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              profilePicture: profile.photos[0].value
            });
          }
          done(null, user);
        } catch (err) {
          done(err, false);
        }
      }));

  })
  .catch((error) => {
    console.error('Error fetching login config:', error);
  });
