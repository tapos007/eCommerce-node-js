var express = require('express');
var router = express.Router();
var PageController = require('../controllers/pageController');
const {check, validationResult} = require('express-validator/check');
const {matchedData, sanitize} = require('express-validator/filter');

// show all pages
router.get('/', PageController.getAllPage);

// insert a new page get request
router.get('/add-page', PageController.pageCreateGet);

// insert a new page post request

router.post('/add-page', [
    check('title').isLength({min: 1}).trim().withMessage('Title must have a value.'),
    check('content').isLength({min: 1}).trim().withMessage('Content must have a value.')
], PageController.pageCreatePost);

// update a new page get request

router.get('/edit-page/:slug', PageController.pageUpdateGet);


// update a new page post request

router.post('/update-page', [
    check('title').isLength({min: 1}).trim().withMessage('Title must have a value.'),
    check('content').isLength({min: 1}).trim().withMessage('Content must have a value.')

], PageController.pageUpdatePost);

// delete page

router.delete('/delete-page/:slug', PageController.pageDeletePost);

// reorder  page

router.post('/reorder-page', PageController.pageReorderPost);
module.exports = router;