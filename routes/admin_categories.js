var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const Category = require('../models/category');
require('express-async-errors');

/**
 * Get category pages index
 */

// define the home page route
router.get('/', function (req, res) {
    Category.find({}).exec((err,categories)=>{
        res.render('category/pages',{
            categories
        });
    });
});
/**
 * Get add page
 */

router.get('/add-category', function (req, res) {
    var title ="";
    var slug = "";
    res.render('category/add_page',{
        title,
        slug
    });
});


/**
 * POST add category
 */

router.post('/add-category',[
    check('title').isLength({ min: 1 }).trim().withMessage('Title must have a value.'),
], function (req, res) {
    
    
    let {title} = req.body;
    let slug = req.body.slug.replace(/\s+/g,'-').toLowerCase();
    if(slug=="") slug = title.replace(/\s+/g,'-').toLowerCase();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('category/add_page', {
            title,slug,errors: errors.array() });
    }else{
        Category.findOne({ 'slug': slug },   (err, page)=> {
            if(page){
                res.flash('danger','Category slug exits , choolse another.');
                res.render('category/add_page', { title,slug });

            }else{
                var category = new Category({ title,slug });
                category.save(function (err) {
                    if (err) return console.log(err);
                    res.flash('success','Category Added.');
                    res.redirect('/admin/category');
                    }
                );
            }
        });
    }
    
});





/**
 * Get a  Single Category
 */


router.get('/edit-category/:slug',async function (req, res) {

    try {
        var Dataslug = req.param('slug');
        var category = await Category.findOne({'slug':Dataslug});
        let {title,slug,content,_id}= category;
        res.render('category/edit_page',{title,slug,_id});
    }catch(err){
        res.flash('error',err.message);
        res.redirect('/admin/category');
    }

});


/**
 * Update Category
 */

router.post('/update-category',[
    check('title').isLength({ min: 1 }).trim().withMessage('Title must have a value.'),
], async function (req, res) {

    var backURL=req.header('Referer') || '/';
    let {title} = req.body;
    let slug = title.replace(/\s+/g,'-').toLowerCase();
    let id = req.body.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        // do your thang
        res.redirect(backURL);
    }else{

        try{

            var category = await Category.findOne({slug,_id:{'$ne':id}});

            if(category){
                res.flash('info','category slug exits, choose another');
                // do your thang
               // console.log(req);
                res.redirect('/admin/category');
            }else{
                var nowCategory = await Category.findById(id);
                nowCategory.title = title;
                nowCategory.slug = slug;
                await  nowCategory.save();
                res.flash('success','Category update successfully');
                res.redirect('/admin/category');
            }

        }catch(err){
            res.flash('danger',err.message);
            // do your thang
            res.redirect(backURL);
        }

    }

});

/**
 * delete a page
 */

router.delete('/delete-category/:slug',async function (req, res) {

    try {
        var slug = req.params.slug;
        var category = await Category.findOne({slug});
        if(category){
           await category.remove();
           res.json({success:true,message:"category delete successfully"});
        }
    }catch(err){
        res.json({success:false,message:"category delete not success"});
    }

});

module.exports = router;