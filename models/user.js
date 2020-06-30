const Bcrypt = require('bcryptjs');
const mongoose = require('mongoose') // import mongoose
    // const passportLocalMongoose = require('passport-local-mongoose');

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
        type: String,
        required: true,
    },
    // posts: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'post',
    // }, ],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
    }],
    role: {
        type: String,
        default: 'basic',
        enum: ["basic", "admin"]
    },
}, {
    collection: 'User'
});

userSchema.pre('save', function() {
    const hashedPassword = Bcrypt.hashSync(this.password, 12);
    this.password = hashedPassword;
});


// create and export the model
module.exports = mongoose.model('User', userSchema)