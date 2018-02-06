var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PageSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    sorting: {
        type: Number
    }
});
var Page = mongoose.model('Page', PageSchema);

// make this available to our users in our Node applications
module.exports = Page;