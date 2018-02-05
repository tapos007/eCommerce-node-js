var express = require('express')
var router = express.Router()


// define the home page route
router.get('/', function (req, res) {
    res.render('index',{
        title:'Admin'
    });
});
// define the about route

module.exports = router