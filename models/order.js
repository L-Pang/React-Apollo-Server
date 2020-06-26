const mongoose = require('mongoose') // import mongoose

const Schema = mongoose.Schema

// Create the Schema for Mongoose that corresponds to that type we set in GraphQL
const orderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    customer: {
        id: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        username: {
            type: String,
            required: true,
            unique: true,
        }
    },
    status: {
        type: Boolean,
        required: true
    }
}, {
    collection: 'Order'
})

// create and export the model
module.exports = mongoose.model('Order', orderSchema)