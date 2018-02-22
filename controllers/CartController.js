const {check, validationResult} = require('express-validator/check');
const {matchedData, sanitize} = require('express-validator/filter');
const Product = require('../models/product');
require('express-async-errors');

module.exports = {
    ShowCartPage: async (req, res) => {
        res.render("cart/cartindex");
    },

    AddPRoductCart: async (req, res) => {
        try{
            let nowSlug = req.params.slug;
            let product = await Product.findOne({slug:nowSlug});
            let {title,slug,_id,price,desc,image} = product;
            if(typeof req.session.cart =="undefined"){
                req.session.cart = [];
                req.session.cart.push({title,slug,_id,price,desc,image,qty:1});
            }else{
                var foundIndex = req.session.cart.findIndex(x => x._id == product._id);
                console.log("is data",foundIndex);
                if(foundIndex>=0){
                    req.session.cart[foundIndex]['qty']++;
                    res.flash('success','Product Updated');
                }else{
                    req.session.cart.push({title,slug,_id,price,desc,image,qty:1});
                    res.flash('success','Product added');
                }
            }
            res.redirect('back');
        }catch(err){
            console.log(err);
        }

    },

    CartPageProductUpdate: async (req,res)=>{
        var id = req.body.id;
        var qty = req.body.qty;
        var foundIndex = req.session.cart.findIndex(x => x._id == id);
        if(foundIndex>=0){
            req.session.cart[foundIndex]['qty'] = qty;
        }
        var total = 0;
        req.session.cart.forEach(x=>{
            total += (x.price * x.qty);
        });
        res.send({success:true,msg:"update sucessfully",total});


    },

    CartPageProductDelete: async (req,res)=>{
        var id = req.body.id;
        var foundIndex = req.session.cart.findIndex(x => x._id == id);
        console.log(foundIndex);
        if(foundIndex>=0){
            req.session.cart.splice(foundIndex, 1);
        }
        var total = 0;
        req.session.cart.forEach(x=>{
            total += (x.price * x.qty);
        });
        res.send({success:true,msg:"delete sucessfully",total});


    }


};

