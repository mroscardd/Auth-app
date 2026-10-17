import { MongoClient } from 'mongodb'


const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@localhost:${process.env.MONGO_PORT}`
const client = new MongoClient(url)

let db
const dbName = 'usersdb'

export async function connectDB() {
    await client.connect()

    console.log('¡Conectado con éxito a MongoDB!')

    db = client.db(dbName)
}

export function getDB() {
    return db
}


