var express = require('express')
const { body,validationResult } = require('express-validator/check');
var router = express.Router()

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

router.post('/add-page', function (req, res,next) {
    
    body('title').isLength({ min: 1 }).trim().withMessage('Title must have a value.')
    body('content').isLength({ min: 1 }).trim().withMessage('Cotent must have a value.')

    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g,'-').toLowerCase();
    var content = req.body.content;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("ny errors",errors)
        // There are errors. Render form again with sanitized values/errors messages.
        res.render('admin/add-page', {
             title, slug,content, errors: errors.array() });
        return;
    }else{
        console.log('success');
    }
    
});
module.exports = router