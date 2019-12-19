let jwt = require('jsonwebtoken');
const keys = require("../../config/keys");

let checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'] || req.headers['jwt']; // Express headers are auto converted to lowercase

  if (token) {
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
      }
    jwt.verify(token, keys.secretOrKey, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};

let getUserID = (req) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'] || req.headers['jwt']; // Express headers are auto converted to lowercase
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }
  const decoded = jwt.verify(token, keys.secretOrKey);
  return decoded.id;
};

module.exports = {
  checkToken: checkToken,
  getUserID : getUserID
}