const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  googleId: {
    type: String,
    unique: false,
    required: false,
    default: null
  },
  email: {
    type: String,
    unique: true,
    required: false
  },
  name: {
    type: String,
    unique: false,
    required: true
  },
  password: {
    type: String,
    unique: false,
    required: false
  },
  photoProfileName: {
    type: String,
    unique: false,
    required: false,
    default: null
  },
  aboutYourself: {
    type: String,
    unique: false,
    required: false,
    default: null
  }
}, {versionKey: false});

const User = module.exports = mongoose.model('User', userSchema);

module.exports.getUserById = (id, callback) => {
  User.findById(id, callback);
};

module.exports.getUserByEmail = (email, callback) => {
  const query = {email: email};
  User.findOne(query, callback)
};

module.exports.addUser = (newUser, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    })
  })
};

module.exports.comparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
};
