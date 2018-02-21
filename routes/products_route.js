var express = require('express');
var router = express.Router();
const {check, validationResult} = require('express-validator/check');
const {matchedData, sanitize} = require('express-validator/filter');
const ProductController = require('../controllers/productMainController');
var path = require("path");

// show all categories
router.get('/', ProductController.getAllProduct);

// insert a new product get request
router.get('/category/:slug', ProductController.categoryWiseProduct);
router.get('/:slug', ProductController.ProductDetails);


// insert a new product post request


module.exports = router;