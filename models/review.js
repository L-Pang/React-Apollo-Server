const mongoose = require('mongoose') // import mongoose

const Schema = mongoose.Schema

// Create the Schema for Mongoose that corresponds to that type we set in GraphQL
const reviewSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    productId: {
        type: Schema.ObjectId,
        ref: 'Product'
    },
    userId: {
        type: Schema.ObjectId,
        ref: 'User'
    }
}, {
    collection: 'Review'
})

// create and export the model
module.exports = mongoose.model('Review', reviewSchema)