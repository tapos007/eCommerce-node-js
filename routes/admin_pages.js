var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const Page = require('../models/page');
require('express-async-errors');

/**
 * Get pages index
 */

// define the home page route
router.get('/', function (req, res) {
    Page.find({}).sort({'sorting':1}).exec((err,pages)=>{
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
], function (req, res) {
    
    
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
                res.flash('danger','Page slug exits , choolse another.');
                res.render('admin/add_page', { title,slug,content });

            }else{
                var page = new Page({ title,slug,content,sorting:0 });
                page.save(function (err) {
                    if (err) return console.log(err);
                    res.flash('success','Page Added.'); 
                    res.redirect('/admin/pages');
                    }
                );
            }
        });
    }
    
});



/**
 * Post Reorder Pages
 */


router.post('/reorder-page',async function (req, res) {

    var ids = req.body['id[]'];
    var count = 0;
    for (let id of ids) {
            try {
                count++;
                const page = await Page.findById(id);
                console.log(page);
                page.sorting = count;
                 await page.save();
            } catch (err) {
                console.log(err);
            }
    }
});

/**
 * Get a  Single  Pages
 */


router.get('/edit-page/:slug',async function (req, res) {

    try {
        var Dataslug = req.param('slug');
        var page = await Page.findOne({'slug':Dataslug});
        let {title,slug,content,_id}= page;
        res.render('admin/edit_page',{title,slug,content,_id});
    }catch(err){
        res.flash('error',err.message);
        res.redirect('/admin/pages');
    }

});


/**
 * Update   page
 */

router.post('/update-page',[
    check('title').isLength({ min: 1 }).trim().withMessage('Title must have a value.'),
    check('content').isLength({ min: 1 }).trim().withMessage('Content must have a value.'),
], async function (req, res) {

    var backURL=req.header('Referer') || '/';
    let {title,content} = req.body;
    let slug = title.replace(/\s+/g,'-').toLowerCase();
    let id = req.body.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        // do your thang
        res.redirect(backURL);
    }else{

        try{

            var page = await Page.findOne({slug,_id:{'$ne':id}});

            if(page){
                res.flash('info','Page slug exits, choose another');
                // do your thang
               // console.log(req);
                res.redirect('/admin/pages');
            }else{
                var nowPage = await Page.findById(id);
                nowPage.title = title;
                nowPage.slug = slug;
                nowPage.content = content;
                await  nowPage.save();
                res.redirect('/admin/pages');
            }

        }catch(err){
            res.flash('danger',err.message);
            // do your thang
            res.redirect(backURL);
        }

    }

});

module.exports = router;