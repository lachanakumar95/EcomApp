const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../api/user/auth/userModel');
const loginConfigModel = require('../api/settings/loginconfig/loginconfigModel');

const fs = require('fs');
const path = require('path');

// Define the path to the morgan log file
const logFilePath = path.join(__dirname, '../error.log');
function formatDateTo12Hour(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12; // Convert to 12-hour format
  const formattedTime = `${hours}:${minutes}:${seconds} ${ampm}`;
  return `${day}/${month}/${year}, ${formattedTime}`;
}

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (user) {
      done(null, user);
    } else {
      done(new Error("User not found"), null);
    }
  } catch (err) {
    done(err, null);
  }
});

(async () => {
  try {
    const loginConfigData = await loginConfigModel.findOne();
    if (!loginConfigData || !loginConfigData.google_clientId || !loginConfigData.google_clientSecret) {
       // Append the error log to the access.log file
        const logEntry = `
        [${formatDateTo12Hour(new Date())}] 
        Error: 'Invalid login config data for Google OAuth'`;
        fs.appendFile(logFilePath, logEntry, (error) => {
            if (error) {
                console.error('Failed to write error to log file:', error);
            }
        });
    }

    // Initialize Google Strategy
    passport.use(
      new GoogleStrategy(
        {
          clientID: loginConfigData.google_clientId,
          clientSecret: loginConfigData.google_clientSecret,
          callbackURL: '/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            let user = await User.findOne({ googleId: profile.id });
            if (!user) {
              user = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                profilePicture: profile.photos[0].value,
              });
            }
            done(null, user);
          } catch (err) {
            done(err, false);
          }
        }
      )
    );
  } catch (error) {
    console.error("Error initializing Google Strategy:", error.message);
  }
})();
