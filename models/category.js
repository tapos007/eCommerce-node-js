var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    }
});
var Category = mongoose.model('Category', CategorySchema);

// make this available to our users in our Node applications
module.exports = Category;