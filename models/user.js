const bcrypt = require('bcrypt'); // import bcrypt
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
        type: Number,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    // posts: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'post',
    // }, ],
    orders: [{
        id: {
            type: Schema.ObjectId,
            ref: 'Order'
        },
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
        status: {
            type: Boolean,
            required: true
        }
    }]
}, {
    collection: 'User'
});

// userSchema.pre('save', function() {
//     const hashedPassword = bcrypt.hashSync(this.password, 12);
//     this.password = hashedPassword;
// });

userSchema.pre('save', async function(next) {
    //'this' refers to the current document about to be saved
    const user = this;
    //Hash the password with a salt round of 10, the higher the rounds the more secure, but the slower
    //your application becomes.
    const hash = await bcrypt.hash(this.password, 10);
    //Replace the plain text password with the hash and then store it
    this.password = hash;
    //Indicates we're done and moves on to the next middleware
    next();
});

//We'll use this later on to make sure that the user trying to log in has the correct credentials
userSchema.methods.isValidPassword = async function(password) {
    const user = this;
    //Hashes the password sent by the user for login and checks if the hashed password stored in the
    //database matches the one sent. Returns true if it does else false.
    const compare = await bcrypt.compare(password, user.password);
    return compare;
}


// userSchema.plugin(passportLocalMongoose, {
//     usernameField: 'email'
// });

// create and export the model
module.exports = mongoose.model('User', userSchema)