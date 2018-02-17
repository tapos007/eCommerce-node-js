var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductImageSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    thumb: {
        type: String,
        required: true
    },

});
var ProductImage = mongoose.model('ProductImage', ProductImageSchema);

// make this available to our users in our Node applications
module.exports = ProductImage;