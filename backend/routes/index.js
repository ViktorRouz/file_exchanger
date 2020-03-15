var express = require('express');
var router = express.Router();
const passport = require('passport');

const auth = passport.authenticate('jwt', {session: false});

const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController');
const filesController = require('../controllers/filesController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Auth routes
router.post('/register', authController.register);
router.post('/authenticate', authController.authenticate);

// Profile routes
router.get('/profile/:id', auth, authController.getProfile);
router.post('/profile/:id', profileController.uploadPhotoProfile);
router.put('/profile/:id', auth, profileController.updateDataProfile);
router.delete('/profile/:id', auth, profileController.deletePhoto);

router.get('/profile/:id/photo/:id', profileController.getPhotoProfile);

router.get('/profile/:id/files', filesController.getFilesAuthor);
router.post('/profile/:id/files/', filesController.createFile);

router.post('/download-file', filesController.getFile);
router.get('/download-file', filesController.getDataFile);
router.delete('/profile/:id/files/:id', auth, filesController.deleteFile);

module.exports = router;
