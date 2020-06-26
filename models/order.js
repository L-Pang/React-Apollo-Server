const mongoose = require('mongoose') // import mongoose

const Schema = mongoose.Schema

// Create the Schema for Mongoose that corresponds to that type we set in GraphQL
const orderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    orders: [{
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
        price: {
            type: Number,
            required: true
        },
        qty: {
            type: Number,
            required: true
        }
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    complete: {
        type: Boolean,
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
    collection: 'Order'
})

// create and export the model
module.exports = mongoose.model('Order', orderSchema)