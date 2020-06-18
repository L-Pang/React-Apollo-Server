const mongoose = require('mongoose') // import mongoose

const Schema = mongoose.Schema

// Create the Schema for Mongoose that corresponds to that type we set in GraphQL
const categorySchema = new Schema({

    title: {
        type: String,
        required: true
    }

})

// create and export the model
module.exports = mongoose.model('Category', categorySchema)