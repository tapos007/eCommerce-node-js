var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const Page = require('../models/page');

/**
 * Get pages index
 */

// define the home page route
router.get('/', function (req, res) {
    Page.find({}).sort({'_id':-1}).exec((err,pages)=>{
        res.render('admin/pages',{
            pages:pages
        });
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
    check('content').isLength({ min: 1 }).trim().withMessage('Content must have a value.'),
], function (req, res,next) {
    
    
    let {title,content} = req.body;
    let slug = req.body.slug.replace(/\s+/g,'-').toLowerCase();
    if(slug=="") slug = title.replace(/\s+/g,'-').toLowerCase();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('admin/add_page', {
            title,slug,content,errors: errors.array() });
    }else{
        Page.findOne({ 'slug': slug },   (err, page)=> {
            if(page){
                req.flash('danger','Page slug exits , choolse another.');
                res.render('admin/add_page', { title,slug,content });

            }else{
                var page = new Page({ title,slug,content,sorting:0 });
                page.save(function (err) {
                    if (err) return console.log(err);
                    req.flash('success','Page Added.'); 
                    res.redirect('/admin/pages');
                    }
                );
            }
        });
    }
    
});
module.exports = router