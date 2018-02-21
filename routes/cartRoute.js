var express = require('express')
var router = express.Router();
var CartController = require('../controllers/CartController');
const {check, validationResult} = require('express-validator/check');
const {matchedData, sanitize} = require('express-validator/filter');


// define the home page route
router.get('/', CartController.getAllCartProduct);


router.get('/add-product/:slug', CartController.AddPRoductCart);

module.exports = router;