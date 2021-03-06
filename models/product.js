const mongoose = require('mongoose') // import mongoose

const Schema = mongoose.Schema

// Create the Schema for Mongoose that corresponds to that type we set in GraphQL
const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    location: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    category: {
        id: {
            type: Schema.ObjectId,
            ref: 'Category'
        },
        title: {
            type: String,
            required: true
        }
    }
}, {
    collection: 'Product'
})

// create and export the model
module.exports = mongoose.model('Product', productSchema)