const CLIENT_URL = "http://localhost:3000/";
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require("dotenv")
const cors = require('cors')
const session = require('express-session')
const passport = require('passport')
const User = require('./user')

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
// const TwitterStrategy = require('passport-twitter').Strategy;
// const GitHubStrategy = require('passport-github').Strategy;


dotenv.config();

const app = express();

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("Connected to mongoose successfully")
});

// Middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  }))

passport.use(
    new GoogleStrategy(
      // Configuration object
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK
      },
      // The verify callback function
      function(accessToken, refreshToken, profile, cb) {
        //   console.log(profile)
          // a user has logged in with OAuth...
          User.findOne({ googleId: profile.id }).then(async function(user) {

          if (user) return cb(null, user);
          // We have a new user via OAuth!
          try {
            user = await User.create({
              name: profile.displayName,
              googleId: profile.id,
              avatar: profile.photos[0].value,
            });
            return cb(null, user);
          } catch (err) {
            return cb(err);
          }
        });
      }
    )
    )
  passport.serializeUser(function(user, cb) {
    cb(null, user._id);
  });

  passport.deserializeUser(function(userId, cb) {
    User.findById(userId).then(function(user) {
      cb(null, user);
    });
  });

app.use(
    session({
        secret: process.env.GOOGLE_SECRET,
        resave: true,
        saveUninitialized: true,
        cookie: {
            sameSite: "none",
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 7 // One Week
        }
    }))


app.use(passport.initialize());
app.use(passport.session());


app.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
      //   cookies: req.cookies
    });
  }
});

app.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

app.get("/logout", (req, res) => {
  req.logout(() => {
      console.log('logging out')
  });
  res.redirect(CLIENT_URL);
});


app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/oauth2callback',
    passport.authenticate('google', { failureRedirect: "/login/failed", session: true }),
    function (req, res) {
        console.log(req.user)
        res.redirect(CLIENT_URL);
    });

    


app.listen(process.env.PORT || 3001, () => {
    console.log("Server Started");
})