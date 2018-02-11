var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const ProductController = require('../controllers/productController');

// show all categories
router.get('/', ProductController.getAllProduct);

// insert a new product get request
router.get('/add-product', ProductController.productCreateGet);


// insert a new category post request

router.post('/add-category',[
    check('title').isLength({ min: 1 }).trim().withMessage('Title must have a value.'),
], ProductController.productCreatePost);



// update a new product get request


router.get('/edit-product/:slug',ProductController.productUpdateGet);


// update a new product post request
router.post('/update-product',[
    check('title').isLength({ min: 1 }).trim().withMessage('Title must have a value.'),
], ProductController.productUpdatePost);

// delete product

router.delete('/delete-product/:slug',ProductController.productDeletePost);

module.exports = router;