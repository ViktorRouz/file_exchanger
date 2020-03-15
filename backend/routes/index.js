var express = require('express');
var router = express.Router();

const authController = require('../controllers/authController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Auth routes
router.post('/register', authController.register);
router.post('/authenticate', authController.authenticate);

module.exports = router;
