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

        const validator = await bcrypt.hash(validator_nocrypt, 10)

        const sieteDias = 7 * 24 * 60 * 60 *1000
        const expiresAt = new Date(Date.now() + sieteDias)

        await collection.findOneAndUpdate(
            { user_id },
            { $set: {selector, validator, expiresAt} },
            { upsert: true })

        return {
            selector,
            validator: validator_nocrypt
        }
    }

    static async refreshSession(selector, validator) {
        const db = getDB()
        const collection = db.collection('sessions')

        const sieteDias = 7 * 24 * 60 * 60 *1000

        const userSession = await this.findUserSession(selector)

        if (userSession) {
            const match = await bcrypt.compare(validator, userSession.validator)
                if (!match) {   
                    throw new Error("Error to refresh session")
                }
        } else {
            throw new Error ("Error to refresh session")
        }   
        
        if (Date.now() > userSession.expiresAt.getTime()) {
            await this.deleteUserSession(selector)
            throw new Error ("Error to refreshsession")
        } 
        
        const validator_nocrypt = crypto.randomBytes(32).toString('hex')
        const newValidator = await bcrypt.hash(validator_nocrypt, 10)
        const expiresAt = new Date(Date.now() + sieteDias)

        const result = await collection.findOneAndUpdate(
            {   
                selector, 
                validator: userSession.validator,
                expiresAt: { $gt: new Date() }
            },
            { $set: {validator: newValidator, expiresAt} },
            { returnDocument: 'after' }
        )

        if (!result) {
            throw new Error("Session already rotated or invalid")
        }   
        return {
            selector,
            newValidator: validator_nocrypt
        }
    }

    static async deleteUserSession(selector) {
        const db = getDB()
        const collection = db.collection('sessions')
        await collection.deleteOne({selector})
    }
    static async findUserSession(selector) {
        const db = getDB()
        const collection = db.collection('sessions')
        const userSession = await collection.findOne({selector})
        return userSession
    }
}