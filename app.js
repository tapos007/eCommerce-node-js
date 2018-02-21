const express = require('express');
const path = require('path');
const cons = require('consolidate');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('express-flash-2');
const session = require('express-session');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const config = require('./config/database');
const fileUpload = require('express-fileupload');
const fs = require('fs-extra');
const mkdirp = require('mkdirp');
const app = express();
// connect with mongo db
mongoose.connect(config.database);
// assign the nunjucks engine to .html files
app.engine('html', cons.nunjucks);

// set .html as the default extension

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
// static files for image , css, javascript

app.use(express.static('public'));

// set global errors variable
app.locals.errors = null;

// Get page model
var Page = require('./models/page');
var Category = require('./models/category');

Page.find({}).sort({'sorting': 1}).exec((err, pages) => {
    if(err){
      console.log(err);
    }else{
      app.locals.pages = pages;
    }
});
// get all category
Category.find((err, categories) => {
    if(err){
        console.log(err);
    }else{
        app.locals.categories = categories;
    }
});

// add express-fileupload middleware
app.use(fileUpload({
   // safeFileNames: true
}));


// add body parser middleware

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// end add body parser middleware

// add session
app.use(cookieParser('keyboard cat'));
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(flash());

// end session

//

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("its open now");
});

// get cart data

app.get('*',(req,res,next)=>{
   res.locals.cart = req.session.cart;
   next();
});

// set routes 
var pages = require('./routes/pages');
var adminPages = require('./routes/admin_pages');
var adminCategories = require('./routes/admin_categories');
var adminProduct = require('./routes/admin_products');
var ProductRoute = require('./routes/products_route');
var CartRoute = require('./routes/cartRoute');

app.use('/admin/pages',adminPages);
app.use('/admin/category',adminCategories);
app.use('/admin/products',adminProduct);
app.use('/products',ProductRoute);
app.use('/cart',CartRoute);
app.use('/',pages);




app.listen(3000, () => console.log('Example app listening on port 3000!'))