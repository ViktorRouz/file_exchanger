const User = require('../models/user');
const config = require('../config/database');
const jwt = require('jsonwebtoken');

const sendJSONResponse = function (res, content) {
  res.json(content);
};

exports.register = async (req, res, next) => {
  try {
    if (!req.body.name || !req.body.email || !req.body.password) {
      sendJSONResponse(res, {
        message: 'All fields are required'
      });
    }

    const newUser = new User();

    newUser.name = req.body.name;
    newUser.email = req.body.email;
    newUser.password = req.body.password;

    User.addUser(newUser, (err, user) => {
      if (err) {
        sendJSONResponse(res, {
          success: false,
          message: 'Failed to register user'
        });
      } else {
        sendJSONResponse(res, {
          success: true,
          message: 'User registered'
        });
      }
    });
  } catch (error) {
    sendJSONResponse(res, {
      success: false,
      message: error.message,
    });
  }
};

exports.authenticate = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.getUserByEmail(email, (err, user) => {
    if (err) throw err;
    if (!user) {
      return sendJSONResponse(res, {
        success: false,
        message: 'User not found'
      });
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign(user.toJSON(), config.secret, {
          expiresIn: 60400 // 1 week
        });

        sendJSONResponse(res, {
          success: true,
          token: 'JWT ' + token,
          user: {
            id: user._id,
            email: user.email,
            name: user.name
          }
        });
      } else {
        return sendJSONResponse(res, {
          success: false,
          message: 'Wrong password'
        });
      }
    })
  });
};

exports.getProfile = (req, res, next) => {

  User.findOne({_id: req.params.id})
    .then(user => {
      return res.json({user: user, authUser: req.user})
    })
    .catch(err => res.json(err));
};
