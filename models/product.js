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

var ProductSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String
    },
    similar_image: {
        type: [ProductImageSchema],
        'default': []
    }
});
var Product = mongoose.model('Product', ProductSchema);

// make this available to our users in our Node applications
module.exports = Product;