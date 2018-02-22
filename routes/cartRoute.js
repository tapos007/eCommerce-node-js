var express = require('express')
var router = express.Router();
var CartController = require('../controllers/CartController');
const {check, validationResult} = require('express-validator/check');
const {matchedData, sanitize} = require('express-validator/filter');


// define the home page route
router.get('/', CartController.ShowCartPage);


router.get('/add-product/:slug', CartController.AddPRoductCart);

router.post('/update-cart',CartController.CartPageProductUpdate);
router.post('/delete-cart',CartController.CartPageProductDelete);

module.exports = router;