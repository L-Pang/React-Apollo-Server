const seeder = require("mongoose-seed");
const data = require("./asset/data");

// const db = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-3pmsx.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://admin:hello@cluster0-3pmsx.mongodb.net/Foodie-db?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true
});

client.connect(err => {
    // const collection = client.db("Foodie-db").collection("Foodie");
    db = client.db("Foodie-db")
    console.log("Connected correctly to server");


    seeder.connect(db, function() {
        seeder.loadModels([
            "./models/product"
        ]);
        seeder.clearModels(["proudct"]);
        seeder.populateModels(data, function(err, done) {
            if (err) {
                return console.log("seed error", err)
            }
            if (done) {
                return console.log("seed done", done)
            }
            seeder.disconnect()
        })
    })


    // perform actions on the collection object
    client.close();
});


// seeder.connect(db, function() {
//     seeder.loadModels([
//         "./models/product"
//     ]);
//     seeder.clearModels(["proudct"]);
//     seeder.populateModels(data, function(err, done) {
//         if (err) {
//             return console.log("seed error", err)
//         }
//         if (done) {
//             return console.log("seed done", done)
//         }
//         seeder.disconnect()
//     })
// })