import { MongoClient } from 'mongodb'


const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@localhost:${process.env.MONGO_PORT}`
const client = new MongoClient(url)

let db

export async function connectDB() {

    try {
        await client.connect()

        console.log('¡Conectado con éxito a MongoDB!')

        db = client.db('usersdb')
        
    } catch (error) {
        console.error('Problema de conexión: ', error)
    }    

}

export function getDB() {
    return db 
}






