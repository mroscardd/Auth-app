import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { ObjectId } from 'mongodb'
import { getDB } from '../config/database.js'

export class SessionModel {
    static async createSession(user_id) {

        const db = getDB()
        const collection = db.collection('sessions')

        let selector 
        while (true) {
            selector = crypto.randomBytes(16).toString('hex')
            const existingSelector = await collection.findOne({selector})
            if (!existingSelector) {
                break
            }
        }

        const validator_nocrypt = crypto.randomBytes(32).toString('hex')

        const salt = await bcrypt.genSalt(10);
        const validator = await bcrypt.hash(validator_nocrypt, salt)

        const treintaDias = 30 * 24 * 60 * 60 *1000
        const expiresAt = new Date(Date.now() + treintaDias)

        const existingId = await collection.findOne({ user_id })

        await collection.findOneAndUpdate(
            { user_id },
            { $set: {selector, validator, expiresAt} },
            { upsert: true })


        return {
            selector,
            validator: validator_nocrypt
        }
    }
}