const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-3pmsx.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true
});


client.connect(err => {
    // const collection = client.db("Foodie-db").collection("Foodie");
    db = client.db("Foodie-db")
    console.log("Connected correctly to server");
    // perform actions on the collection object
    // client.close();
});