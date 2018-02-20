const {check, validationResult} = require('express-validator/check');
const {matchedData, sanitize} = require('express-validator/filter');
const Page = require('../models/page');
require('express-async-errors');

module.exports = {
    getAllPage: async (req, res) => {
        Page.find({}).sort({'sorting': 1}).exec((err, pages) => {
            res.render('admin/pages', {
                pages: pages
            });
        });
    },

    pageCreateGet: async (req, res) => {
        var title ="";
        var slug = "";
        var content = "";
        res.render('admin/add_page',{
            title,
            slug,
            content
        });
    },

    pageCreatePost: async (req, res) => {


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
                    var page = new Page({ title,slug,content,sorting:100 });
                    page.save(function (err) {
                            if (err) return console.log(err);

                            res.flash('success','Page Added.');
                            res.redirect('/admin/pages');
                        }
                    );
                }
            });
        }
    },
    pageUpdateGet: async (req, res) => {
        try {
            var Dataslug = req.param('slug');
            var page = await Page.findOne({'slug':Dataslug});
            let {title,slug,content,_id}= page;
            res.render('admin/edit_page',{title,slug,content,_id});
        }catch(err){
            res.flash('error',err.message);
            res.redirect('/admin/pages');
        }
    },
    pageUpdatePost: async (req, res) => {

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
                    await reorderMenu(req);
                    res.redirect('/admin/pages');
                }

            }catch(err){
                res.flash('danger',err.message);
                // do your thang
                res.redirect(backURL);
            }

        }
    },

    pageDeletePost:async (req, res) => {
        try {
            var slug = req.params.slug;
            var page = await Page.findOne({slug});
            if(page){
                await page.remove();
                await reorderMenu(req);
                res.json({success:true,message:"page delete successfully"});
            }
        }catch(err){
            res.json({success:false,message:"page delete not success"});
        }
    },

    pageReorderPost: async (req, res) => {
        var ids = req.body['id[]'];
        await sortPages(ids);
        await reorderMenu(req);


    },

    pageSinglePost: async (req, res) => {

        try{
            var nowslug = req.params.slug;
            var page = await Page.findOne({'slug':nowslug});
            let {title,slug,content,_id} = page;
            res.render('index',{title,slug,content,_id});
        }catch(err){
            res.redirect('/');
        }
    },

    pageSinglePostHome: async (req, res) => {
        try{
            var nowslug = 'home';
            var page = await Page.findOne({'slug':nowslug});
            let {title,slug,content,_id} = page;
            res.render('index',{title,slug,content,_id});
        }catch(err){
            res.redirect('/');
        }
    },
};

async  function sortPages(ids){
    var count = 0;
    for (let id of ids) {
        try {
            count++;
            const page = await Page.findById(id);
            page.sorting = count;
            await page.save();
        } catch (err) {
            console.log(err);
        }
    }

}


async  function reorderMenu(req){
    Page.find({}).sort({'sorting': 1}).exec((err, pages) => {
        if(err){
            console.log(err);
        }else{
            req.app.locals.pages = pages;
        }
    });

}