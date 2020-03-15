const User = require('../models/user');
const multer = require('multer');
const path = require('path');

const storeProfile = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads/profile');
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + '-' + file.originalname)
  }
});

const uploadProfile = multer({storage: storeProfile}).single('file');

const sendJSONResponse = (res, content) => {
  res.json(content);
};

exports.uploadPhotoProfile = (req, res, next) => {
  uploadProfile(req, res, (err) => {
    if (err) {
      return sendJSONResponse(res, {
        success: false,
        err: err
      });
    }

    User.findById(req.params.id).updateOne({
      photoProfileName: req.file.filename
    })
      .then(() => sendJSONResponse(res, {
        success: true,
        originalname: req.file.originalname,
        uploadname: req.file.filename
      }))
      .catch(err => sendJSONResponse(res, {
        success: false,
        err: err
      }));
  });
};

exports.getPhotoProfile = (req, res, next) => {
  filepath = path.join(__dirname, '../public/uploads/profile/') + req.params.id;

  res.sendFile(filepath);
};

exports.updateDataProfile = (req, res, next) => {

  User
    .findById(req.params.id).updateOne({
    name: req.body.name,
    aboutYourself: req.body.aboutYourself
  })
    .then(() => sendJSONResponse(res, {
      name: req.body.name,
      aboutYourself: req.body.aboutYourself,
      success: true
    }))
    .catch(err => sendJSONResponse(res, {
      success: false,
      err: err
    }));
};

exports.deletePhoto = (req, res, next) => {
  User
    .findById(req.params.id).updateOne({
    photoProfileName: null
  })
    .then(news => sendJSONResponse(res, {
      success: true
    }))
    .catch(err => sendJSONResponse(res, {
      success: false,
      err: err
    }));
};
