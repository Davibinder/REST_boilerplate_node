/*!
 * Module dependencies
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Player Profile schema
 */

const PlayerProfileSchema = new Schema({
  userId : {
    type : String,
    unique : true
  },
  profilePicUrl : {
    type : String
  },
  rank : {
    type : Number,
    tag : String,
    default : 25
  },
  isComplete : {
    type : Boolean
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

PlayerProfileSchema.method({});

/**
 * Statics
 */

PlayerProfileSchema.statics.addPlayerProfile = function(data, user, cb) {
  var self = this;
    var newProfile = new self({
      userId : user.id.toString(),
      profilePicUrl : data.profilePicUrl,
      isComplete : ''
    });
    newProfile.save(function(err, profile){
      cb(err,profile);
    });
  };
  
  PlayerProfileSchema.static.editPlayerProfile = function(data, cb) {
  
  }

/**
 * Register
 */

module.exports = PlayerProfile = mongoose.model('PlayerProfile', PlayerProfileSchema);
