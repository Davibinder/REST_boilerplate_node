const JwtStrategy = require("passport-jwt").Strategy,
   FacebookTokenStrategy = require("passport-facebook-token"),
   GoogleTokenStrategy = require("passport-google-token").Strategy,
   TwitterTokenStrategy = require("passport-twitter-token"),
   ExtractJwt = require("passport-jwt").ExtractJwt,
   User = require("../app/models/User"),
   keys = require("../config/keys"),
   auth = require("../config/auth"),
   constants = require("../app/utils/constants");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );

// passport facebook strategy
  passport.use(new FacebookTokenStrategy({
    clientID: auth.facebookAuth.clientID,
    clientSecret: auth.facebookAuth.clientSecret,
    callbackURL     : auth.facebookAuth.callbackURL
  }, 
  function(accessToken, refreshToken, profile, done){
    User.upsertFBUser(accessToken, refreshToken, profile, function(err, user) {
      return done(err, user);
    });
  }));

// passport google strategy
  passport.use(new GoogleTokenStrategy( {
    clientID: auth.googleAuth.clientID,
    clientSecret: auth.googleAuth.clientSecret,
    callbackURL     : auth.googleAuth.callbackURL
  }, function(accessToken, refreshToken, profile, done){
    User.upsertGoogleUser(accessToken, refreshToken, profile, function(err, user) {
      return done(err, user);
    });
  } ) );
  
// passport twitter strategy
 passport.use(new TwitterTokenStrategy({
     consumerKey: auth.twitterAuth.consumerKey,
     consumerSecret: auth.twitterAuth.consumerSecret
   }, function(token, tokenSecret, profile, done) {
    User.upsertTwitterUser(token, tokenSecret, profile, function(err, user) {
      return done(err, user);
    });
     
   }));

};