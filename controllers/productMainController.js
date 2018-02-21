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
            res.render('ProductHome/allproduct', {title:'all products',count, products});

        } catch (err) {
            console.log("some error");
        }
    },

    categoryWiseProduct: async (req, res) => {
        try {
            var nowSlug = req.params.slug;
            const [count, products] = await Promise.all([
                Product.count(),
                Product.find({category:nowSlug})

            ]);
            res.render('ProductHome/allproduct', {title:'all products',count, products});

        } catch (err) {
            console.log("some error");
        }
    },

    ProductDetails: async (req, res) => {
        try {
            var nowSlug = req.params.slug;
            var product = await Product.findOne({slug:nowSlug});
            res.render('ProductHome/product_single', {title:'all products',product});

        } catch (err) {
            console.log("some error");
        }
    },




};
