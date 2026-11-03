import { MongoClient } from 'mongodb'
import bcrypt from 'bcrypt'

const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@localhost:${process.env.MONGO_PORT}`
const client = new MongoClient(url)

const ADMIN_NAME=process.env.ADMIN_NAME
const ADMIN_PASS=process.env.ADMIN_PASS
const ADMIN_EMAIL=process.env.ADMIN_EMAIL

const SUPERADMIN_NAME=process.env.SUPERADMIN_NAME
const SUPERADMIN_PASS=process.env.SUPERADMIN_PASS
const SUPERADMIN_EMAIL=process.env.SUPERADMIN_EMAIL

const NUMERO_USUARIOS=process.env.NUMERO_USUARIOS

await client.connect()
const db = client.db('usersdb')

const collection = db.collection('users')

console.log('¡Conectado con éxito a users')

async function hashedPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword 
}

let superadmin
if (SUPERADMIN_EMAIL && SUPERADMIN_NAME && SUPERADMIN_PASS) {
    superadmin = await collection.findOne({$or: [
            { email: SUPERADMIN_EMAIL },
            { username: SUPERADMIN_NAME }
        ]})
    if (superadmin) {
        console.log("Ya existe un SUPERADMIN con esas credenciales")
    } else {
        superadmin = await collection.insertOne({
            username: SUPERADMIN_NAME, 
            password: await hashedPassword(SUPERADMIN_PASS), 
            email: SUPERADMIN_EMAIL, 
            role: "superadmin"
        })  
        console.log(`SUPERADMIN creado correctamente: ${SUPERADMIN_NAME}`)

    }   
} else {
    console.log("No se han aportado datos suficientes para crear SUPERADMIN")
}

let admin
if (ADMIN_EMAIL && ADMIN_NAME && ADMIN_PASS) {
    admin = await collection.findOne({$or: [
            { email: ADMIN_EMAIL },
            { username: ADMIN_NAME }
        ]})
    if (admin) {
        console.log("Ya existe un ADMIN con esas credenciales")
    } else {
        admin = await collection.insertOne({
                username: ADMIN_NAME, 
                password: await hashedPassword(ADMIN_PASS), 
                email: ADMIN_EMAIL, 
                role: "admin"
        })  
        console.log(`ADMIN creado correctamente: ${ADMIN_NAME}`)
    }   
} else {
    console.log("No se han aportado datos suficientes para crear ADMIN")
}

let user
let count=0
for (let i=0; i<Number(NUMERO_USUARIOS); i++ ){

    user = await collection.findOne({$or: [
        { email: `user${i}@email.com` },
        { username: `user${i}` }
    ]})

    if(!user){
        admin = await collection.insertOne({
                username: `user${i}`, 
                password: await hashedPassword(`user_pass${i}`), 
                email: `user${i}@email.com`, 
                role: "user"
        })
        count += 1
    }

}

console.log(`Se han creado ${count} usuarios`)





