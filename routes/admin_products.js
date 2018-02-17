var express = require('express');
var router = express.Router();
const {check, validationResult} = require('express-validator/check');
const {matchedData, sanitize} = require('express-validator/filter');
const ProductController = require('../controllers/productController');
var path = require("path");

// show all categories
router.get('/', ProductController.getAllProduct);

// insert a new product get request
router.get('/add-product', ProductController.productCreateGet);


// insert a new product post request

router.post('/add-product', [
    check('title').isLength({min: 1}).trim().withMessage('Title must have a value.'),
    check('desc').isLength({min: 1}).trim().withMessage('Desc must have a value.'),
    check('price').isDecimal().withMessage('Price must have a value.'),
    check('category').isLength({min: 1}).trim().withMessage('Category must have a value.'),
    check('image', 'Please upload an image Jpeg, Png')
        .custom((value, {req}) => {
            if(!(req.files.hasOwnProperty('image'))){
                return false;
            }
            var extension = (path.extname(req.files.image.name)).toLowerCase();
            console.log(extension);
            switch (extension) {
                case  '.jpg':
                    return '.jpg';
                case  '.jpeg':
                    return '.jpeg';
                case  '.png':
                    return '.png';
                default:
                    return false;
            }
        })
], ProductController.productCreatePost);


// update a new product get request


router.get('/edit-product/:slug', ProductController.productUpdateGet);


// update a new product post request
router.post('/update-product', [
    check('title').isLength({min: 1}).trim().withMessage('Title must have a value.'),
], ProductController.productUpdatePost);

// delete product

router.delete('/delete-product/:slug', ProductController.productDeletePost);

router.post('/file-upload',ProductController.ProductFileUpload);
router.post('/delete-file',ProductController.ProductFileDelete);

module.exports = router;