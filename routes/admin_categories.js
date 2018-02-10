var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const CategoryController = require('../controllers/categoryController');

// show all categories
router.get('/', CategoryController.getAllCategory);

// insert a new category get request
router.get('/add-category', CategoryController.categoryCreateGet);


// insert a new category post request

router.post('/add-category',[
    check('title').isLength({ min: 1 }).trim().withMessage('Title must have a value.'),
], CategoryController.categoryCreatePost);



// update a new category get request


router.get('/edit-category/:slug',CategoryController.categoryUpdateGet);


// update a new category post request
router.post('/update-category',[
    check('title').isLength({ min: 1 }).trim().withMessage('Title must have a value.'),
], CategoryController.categoryUpdatePost);

// delete category

router.delete('/delete-category/:slug',CategoryController.categoryDeletePost);

module.exports = router;