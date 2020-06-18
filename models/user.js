const mongoose = require('mongoose') // import mongoose

const Schema = mongoose.Schema

// Create the Schema for Mongoose that corresponds to that type we set in GraphQL
const userSchema = new Schema({

    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    }
})

// create and export the model
module.exports = mongoose.model('User', userSchema)