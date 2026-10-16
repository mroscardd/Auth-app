const { MongoClient } = require('mongodb')

const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@localhost:${process.env.MONGO_PORT}`
const client = new MongoClient(url)
let db
const dbName = 'usersdb'

async function connectDB() {
    await client.connect()

    console.log('¡Conectado con éxito a MongoDB!')

    db = client.db(dbName)
}

function getDB() {
    return db
}

module.exports = { connectDB, getDB }
