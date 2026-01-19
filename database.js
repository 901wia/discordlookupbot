let db = null;

async function connect(uri) {
    const { MongoClient } = require("mongodb");
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db("lookupbot");
}

function getDB() {
    return db;
}

module.exports = { connect, getDB };
