import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'
import { getDB } from '../config/database.js'

export class SessionModel {
    static async createSession({user_id, }) {

        const db = getDB()
        const collection = db.collection('sessions')

        const treintaDias = 30 * 24 * 60 * 60 *1000
        const expiresAt = new Date(Date.now() + treintaDias)
        const newSession = await collection.insertOne({
                user_id, 
                selector,
                token_hash, 
                expiresAt
        }) 
    }
}