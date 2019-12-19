'use strict';

const jwt = require("jsonwebtoken"),
      bcrypt = require("bcryptjs"),
      keys = require("../../config/keys"),
      validator = require("validator"),
      User = require("../models/User"),
      mailUtil = require("../utils/email"),
      path = require('path'),
      jwtverification = require("../utils/jwtverification"),
// Load input validation
      validateRegisterInput = require("../validation/register"),
      validateLoginInput = require("../validation/login"),
      PlayerProfile = require("../models/PlayerProfile");

let userController = {}

/**
 * Register
 */
userController.register = async (req, res) => {
      // Form validation
      const { errors, isValid } = validateRegisterInput(req.body);// Check validation
      if (!isValid) {
        return res.status(400).json(errors);
      }
      
      User.findOne({ email: req.body.email }).then(user => {
        if (user) {
          return res.status(400).json({ email: "Email already exists" });
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            country : req.body.country,
            city : req.body.city,
            tc : req.body.tc,
            userType : req.body.userType
          });
      
      // Hash password before saving in database
          bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                  .save()
                  .then(user => res.json(user))
                  .catch(err => console.log(err));
              });
          });
          }
      });
}

/**
 * Sign-In
 */
userController.login = async (req, res) => {
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    // Find user by email
    User.findOne({ email }).then(user => {
      // Check if user exists
      if (!user) {
        return res.status(404).json({ Email: "Email not found" });
      }// Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User matched
          // Create JWT Payload
          const payload = {
            id: user.id,
            date: user.date
          };
          // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 5184000 // 2 months in seconds
            },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
        } else {
          return res
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
        }
      });
    });
}

/**
 * User profile
 */
userController.userProfile = async (req, res) => {
  const email = req.body.email;
  if(!validator.isEmpty(email) && validator.isEmail(email)) {
    User.findOne({email}).then(user => {
      if(!user){
        return res.status(404).json({ profilenotfound: "Profile not found" });
      }
      res.json({
        name : user.name,
        email : user.email,
        country : user.country,
        city : user.city
      });
    });
  }
}

/**
 * Complete profile
 */

userController.completeProfile = async (req, res) => {
  const userId = jwtverification.getUserID(req);
  User.findOne({_id : userId}).then(user => {
    if(!user){
      return res.status(404).json({ NotFound: "Profile not found" });
    }
    const data = req.body;
    PlayerProfile.findOne({userId : user.id}).then(crewMember => {
      if(!crewMember){
        PlayerProfile.addPlayerProfile(data , user, (err, result) => {
          if(err){
            res.status(500).json({
              Status : 'error',
              Message : err.toString()
            });
          }else {
            res.status(200).json({
              Status : 'success',
              Message : 'Profile Updated'
            });
          }
        });         
      }else {
        res.status(500).json({
          Status : 'error',
          Message : 'Profile Already exist'
        });
      }
    });

  });
}

/**
 * Password reset token
 */
userController.usePasswordHashToMakeToken = (user) => {
  const secret = user.password + "-" + user.date;
  const id = user._id.toString();
  const token = jwt.sign({id}, secret, {
    expiresIn: 3600 // 1 hour
  })
  return token
}

/**
 * Send password reset password
 */
userController.sendPasswordResetEmail = async (req, res) => {
  const email = req.body.email;
  console.log("email is"+email);

  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ Email : "Email not found" });
    }    
    const token = userController.usePasswordHashToMakeToken(user);
    const url = mailUtil.getPasswordResetURL(user, token);
    const emailTemplate = mailUtil.resetPasswordTemplate(user, url);

    //
    User.findByIdAndUpdate({ _id: user._id }, { reset_password_token: token }, { upsert: true, new: true }).exec(function(err, new_user) {
      if(!err) {
        const sendEmail = () => {
          mailUtil.transporter.sendMail(emailTemplate, (err, info) => {
          if (err) {
            console.log("error is = "+JSON.stringify(err));
            res.status(500).json("Error sending email");
          }else {
            res.status(200).json("** Email sent **");
            res.json({
              yo: info.response,
              info: info
            });
          }
        })
      }
      sendEmail();
      }else {
        res.status(500).json("Error : "+err);
      }
    });
  });
  
}

/**
 * Render Reset password
 */

userController.renderResetPasswordTemplate = function(req, res) {
  return res.sendFile(path.resolve('./public/reset-password-form.html'));
}

/**
 * Reset password
 */
userController.receiveNewPassword = async (req, res) => {
  const token = req.body.token;
  const password = req.body.newPassword;
  const password2 = req.body.verifyPassword;

  // console.log("payload = "+JSON.stringify(payload));
  // console.log("secret = "+secret);
  // console.log("user.id = "+user.id);
  // console.log("payload.uid = "+payload.id);
  console.log("new password = "+password+" verified pass = "+password2+" and body is = "+JSON.stringify(req.body));

  User.findOne({_id: uid}).then(user => {
    if(!user){
      return res.status(404).json({ NotFound : "User not found" });
    }
    const secret = user.password + "-" + user.date;
    const payload = jwt.decode(token, secret);
    if (payload.id === user.id) {
      bcrypt.genSalt(10, function(err, salt) {
        if (err) return
        bcrypt.hash(password, salt, function(err, hash) {
          if (err) return
          User.findOneAndUpdate({ _id: uid }, { password: hash })
            .then(() => res.status(202).json("Password changed accepted"))
            .catch(err => res.status(500).json(err))
        });
      });
    }else{ 
      res.status(500).json("error in payload or user object");
    }
    
  }).catch(() => {
    console.log("Invalid user");
    res.status(404).json("Invalid user");
  })
}

/**
 * Reset password
 */
userController.resetPassword = function(req, res, next) {
  User.findOne({
    reset_password_token: req.body.token,
  }).exec(function(err, user) {
    if (!err && user) {
      if (req.body.newPassword === req.body.verifyPassword) {
        user.password = bcrypt.hashSync(req.body.newPassword, 10);
        user.reset_password_token = undefined;
        user.save(function(err) {
          if (err) {
            return res.status(422).send({
              message: err
            });
          } else {
            return res.status(200).send({
              success : true,
              message : "Your password has been successful reset"
            });
          }
        });
      } else {
        return res.status(422).send({
          message: 'Passwords do not match'
        });
      }
    } else {
      return res.status(400).send({
        message: 'Password reset token is invalid or has expired.'
      });
    }
  });
}

/**
 * FB Auth
 */
userController.fbAuthProcess = async (req, res) => {
  if (!req.user) {
    return res.send(401, 'User Not Authenticated');
  }
}
/**
 * Google Auth
 */
userController.googleAuthProcess = async (req, res) => {
  if (!req.user) {
    return res.send(401, 'User Not Authenticated');
  }
}
/**
 * Twitter Auth
 */
userController.twitterAuthProcess = async (req, res) => {
  if (!req.user) {
    return res.send(401, 'User Not Authenticated');
  }
}

module.exports = userController;