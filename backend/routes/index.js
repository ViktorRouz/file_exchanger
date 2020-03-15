var express = require('express');
var router = express.Router();
const passport = require('passport');

const auth = passport.authenticate('jwt', {session: false});

const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController');

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

module.exports = router;
