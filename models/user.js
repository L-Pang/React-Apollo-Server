const bcrypt = require('bcrypt'); // import bcrypt
const mongoose = require('mongoose') // import mongoose

const Schema = mongoose.Schema

// Create the Schema for Mongoose that corresponds to that type we set in GraphQL
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    token: {
        type: String,
        required: true,
    }
    // posts: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'post',
    // }, ],
});

userSchema.pre('save', function() {
    const hashedPassword = bcrypt.hashSync(this.password, 12);
    this.password = hashedPassword;
});

// create and export the model
module.exports = mongoose.model('User', userSchema)