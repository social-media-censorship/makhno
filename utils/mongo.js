const { MongoClient } = require('mongodb');

async function connect(config = {}) {
    if(!config.mongodb) {
        throw new Error("Missing MongoDB config");
	// config should be like:
	// { mongodb: 'mongodb://localhost:27017/makhno' }
    }

    const client = new MongoClient(config.mongodb);
    await client.connect();
    return client;
}

module.exports = {
    connect
}
