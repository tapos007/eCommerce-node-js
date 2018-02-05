const express = require('express')
const path = require('path');
const cons = require('consolidate');
const mongoose = require('mongoose');
const config = require('./config/database');
const app = express()
// connect with mongo db
mongoose.connect(config.database);
// assign the nunjucks engine to .html files
app.engine('html', cons.nunjucks);

// set .html as the default extension

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
// static files for image , css, javascript

app.use(express.static('public'))

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("its open now");
});

// set routes 
var pages = require('./routes/pages');
var adminPages = require('./routes/admin_pages');
app.use('/',pages);
app.use('/admin/pages',adminPages);





app.listen(3000, () => console.log('Example app listening on port 3000!'))