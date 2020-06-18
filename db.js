const mongoose = require('mongoose')

// connect to our MongoDB server.
const db = mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@my-first-cluster-hr6uj.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`).then(() => {

    app.listen(5000) // setup server to run on port 5000

}).catch(err => {
    console.log(err)
})

module.exports = db;