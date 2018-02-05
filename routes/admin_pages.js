var express = require('express')
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
    var content = "this is our content";
    res.render('admin/add_page',{
        title,
        slug,
        content
    });
});

module.exports = router