var express = require('express')
var router = express.Router()
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

/**
 * Get pages index
 */

// define the home page route
router.get('/', function (req, res) {
    res.render('index',{
        title:'Admin'
    });
});
/**
 * Get add page
 */

router.get('/add-page', function (req, res) {
    var title ="";
    var slug = "";
    var content = "";
    res.render('admin/add_page',{
        title,
        slug,
        content
    });
});


/**
 * POST add page
 */

router.post('/add-page',[
    check('title').isLength({ min: 1 }).trim().withMessage('Title must have a value.'),
    check('content').isLength({ min: 1 }).trim().withMessage('Cotent must have a value.'),
], function (req, res,next) {
    
    
    let {title,slug,content} = req.body;
    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
        res.render('admin/add_page', {
            title,slug,content,errors: errors.array() });
    }else{
        console.log('success');
    }
    
});
module.exports = router