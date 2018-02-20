const {check, validationResult} = require('express-validator/check');
const {matchedData, sanitize} = require('express-validator/filter');
const Product = require('../models/product');
const Category = require('../models/category');
const fs = require('fs-extra');
const mkdirp = require('mkdirp');
const resizeImg = require('resize-img');
var uniqid = require('uniqid');
require('express-async-errors');

module.exports = {
    getAllProduct: async (req, res) => {

        try {
            const [count, products] = await Promise.all([
                Product.count(),
                Product.find({})

            ]);
            res.render('product/pages', {count, products});

        } catch (err) {
            console.log("some error");
        }
    },

    productCreateGet: async (req, res) => {
        var title = "";
        var desc = "";
        var price = "";
        var categories = await Category.find({});
        res.render('product/add_page', {
            title,
            desc,
            price,
            categories
        });
    },

    productCreatePost: async (req, res) => {

        let {title, desc, price, category} = req.body;
        let slug = title.replace(/\s+/g, '-').toLowerCase();

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            var categories = await Category.find({});
            res.render('product/add_page', {
                title, desc, price, slug, category, categories, errors: errors.array()
            });
        } else {
            Product.findOne({'slug': slug}, (err, page) => {
                if (page) {
                    res.flash('danger', 'Product tilte exits , choose another.');
                    res.render('product/add_page', {title, desc, price, slug, category, categories});

                } else {
                    price = parseFloat(price).toFixed(2);
                    let sampleFile = req.files.image;
                    var fileName = uniqid() + ".png";
                    sampleFile.mv('public/product_images/' + fileName, function (err) {
                        if (err)
                            return res.status(500).send(err);

                        var product = new Product({title, desc, price, slug, category, image: fileName});
                        product.save(function (err) {
                                if (err) return console.log(err);
                                res.flash('success', 'Product Added.');
                                res.redirect('/admin/products');
                            }
                        );
                    });

                }
            });

        }

    },
    productUpdateGet: async (req, res) => {
        try {
            let Dataslug = req.params.slug;
            const [product, categories] = await Promise.all([
                Product.findOne({'slug': Dataslug}),
                await Category.find({})

            ]);
            let {title, slug, desc, _id, price, category, image} = product;
            let location = '/product_images/';
            let galaryImages = [];

            product.similar_image.forEach((value) => {
                var nowLoc = location + value.url;
                galaryImages.push({url: nowLoc, name: value.url});
            });


            res.render('product/edit_page', {title, image, galaryImages, slug, desc, _id, price, category, categories});
        } catch (err) {
            res.flash('error', err.message);
            res.redirect('/admin/products');
        }
    },
    productUpdatePost: async (req, res) => {
        var backURL = req.header('Referer') || '/';
        let {title} = req.body;
        let slug = title.replace(/\s+/g, '-').toLowerCase();
        let id = req.body.id;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            // do your thang
            res.redirect(backURL);
        } else {
            try {

                var product = await Product.findOne({slug, _id: {'$ne': id}});
                if (product) {
                    res.flash('info', 'product slug exits, choose another');
                    // do your thang
                    // console.log(req);
                    res.redirect('/admin/product');
                } else {
                    var nowProduct = await Product.findById(id);
                    nowProduct.title = title;
                    nowProduct.slug = slug;
                    await  nowProduct.save();
                    res.flash('success', 'Product update successfully');
                    res.redirect('/admin/product');
                }

            } catch (err) {
                res.flash('danger', err.message);
                // do your thang
                res.redirect(backURL);
            }
        }

    },

    productDeletePost: async (req, res) => {
        try {
            var slug = req.params.slug;
            var product = await Product.findOne({slug});
            if (product) {
                await product.remove();
                res.json({success: true, message: "product delete successfully"});
            }
        } catch (err) {
            res.json({success: false, message: "product delete not success"});
        }
    },


    ProductFileUpload: async (req, res) => {
        try {

            var id = req.body.product_id;
            var product = await Product.findById(id);
            if (product) {
                let sampleFile = req.files.file;
                var fileName = uniqid() + ".png";
                sampleFile.mv('public/product_images/' + fileName, function (err) {
                    if (err)
                        return res.status(500).send(err);

                    product.similar_image.push({url: fileName, thumb: fileName});
                    product.save();
                    res.json({success: true, message: "product image upload success"});
                });
            }
        } catch (err) {
            res.json({success: false, message: "product delete not success"});
        }
    },

    ProductFileDelete: async (req, res) => {
        try {

            var id = req.body.product_id;
            var fileName = req.body.filename;
            var info = await Product.update({_id: id}, {$pull: {similar_image: {url: fileName}}});
            res.json({success: false, message: info});
        } catch (err) {
            res.json({success: false, message: err.message});
        }
    }


};
