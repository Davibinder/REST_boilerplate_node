const express = require("express"),
      router = express.Router(),
      jwtverification = require("../../utils/jwtverification"),
      userController = require("../../controllers/user.controller"),
      passport = require("passport");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", userController.register);

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", userController.login);

// @route GET api/users/profile
// @desc Get logged in user profile
// @access Public

router.get("/profile", jwtverification.checkToken , userController.userProfile);

// @route post api/users/complete_profile
// @desc Complete user profile
// @access Public
router.post("/complete_profile", jwtverification.checkToken, userController.completeProfile);

// @route post api/users/passresetmail
// @desc Send link for reset password on registered e-mail
// @access Public
router.route("/passresetmail").post(userController.sendPasswordResetEmail);

// @route GET api/users/resetpass
// @route POST api/users/resetpass
// @desc Get password reset form and reset password
// @access Public
router.route("/resetpass")
  .get(userController.renderResetPasswordTemplate)
  .post(userController.resetPassword);

// @route POST api/users/auth/fb
// @desc Get password reset form and reset password
// @access Public
router.route("/auth/fb")
  .post(passport.authenticate('facebook-token'),userController.twitterAuthProcess);

// @route POST api/users/auth/google
// @desc Get password reset form and reset password
// @access Public
router.route("/auth/google")
  .post(passport.authenticate('google-token'),userController.twitterAuthProcess);

// @route POST api/users/auth/twitter
// @desc Get password reset form and reset password
// @access Public
router.route("/auth/twitter")
  .post(passport.authenticate('twitter-token'),userController.twitterAuthProcess);


module.exports = router;