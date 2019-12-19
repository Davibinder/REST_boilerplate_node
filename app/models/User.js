/*!
 * Module dependencies
 */

const constants = require("../utils/constants");

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * User schema
 */

const UserSchema = new Schema({
  name: {
    type: {
      first : String,
      last : String
    }
  },
  email: {
    type: String,
    set: toLower
  },
  password: {
    type: String
  },
  country : {
    type : String
  },
  city : {
    type : String,
  },
  facebookProvider: {
    type: {
      id: String,
      token: String
    },
    select: false
  },
  googleProvider: {
    type: {
      id: String,
      token: String
    },
    select: false
  },
  twitterProvider: {
    type: {
      id: String,
      token: String
    },
    select: false
  },
  reset_password_token: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */

function toLower (v) {
  return v.toLowerCase();
}

/**
 * Statics
 */

UserSchema.statics.upsertFBUser = function(accessToken, refreshToken, profile, cb) {
  var that = this;
  return this.findOne({
    'facebookProvider.id': profile.id
  }, function(err, user) {
    // no user was found, lets create a new one
    if (!user) {
      var newUser = new that({
        name: profile.displayName,
        email: profile.emails[0].value,
        facebookProvider: {
          id: profile.id,
          token: accessToken
        }
      });

      newUser.save(function(error, savedUser) {
        if (error) {
          console.log(error);
        }
        return cb(error, savedUser);
      });
    } else {
      return cb(err, user);
    }
  });
};

UserSchema.statics.upsertGoogleUser = function(accessToken, refreshToken, profile, cb) {
  var that = this;
  if(type === constants.AuthType.facebook)
  return this.findOne({
    'googleProvider.id': profile.id
  }, function(err, user) {
    // no user was found, lets create a new one
    if (!user) {
      var newUser = new that({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleProvider: {
          id: profile.id,
          token: accessToken
        }
      });

      newUser.save(function(error, savedUser) {
        if (error) {
          console.log(error);
        }
        return cb(error, savedUser);
      });
    } else {
      return cb(err, user);
    }
  });
};

UserSchema.statics.upsertTwitterUser = function(accessToken, refreshToken, profile, cb) {
  var that = this;
  if(type === constants.AuthType.facebook)
  return this.findOne({
    'twitterProvider.id': profile.id
  }, function(err, user) {
    // no user was found, lets create a new one
    if (!user) {
      var newUser = new that({
        name: profile.displayName,
        email: profile.emails[0].value,
        twitterProvider: {
          id: profile.id,
          token: accessToken
        }
      });

      newUser.save(function(error, savedUser) {
        if (error) {
          console.log(error);
        }
        return cb(error, savedUser);
      });
    } else {
      return cb(err, user);
    }
  });
};

/**
 * Register
 */

module.exports = User = mongoose.model('User', UserSchema);
