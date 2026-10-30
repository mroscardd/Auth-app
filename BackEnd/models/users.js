import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'
import { getDB } from '../config/database.js'


export class UserModel {
    
    static async findExistingUser({ username, email }){
        try {
  
            const db = getDB()
            const collection = db.collection('users')

            const existingUser = await collection.findOne({$or: [{ username }, { email }]})
            
            return existingUser

        } catch(error) {
            throw new Error("DATABASE_ERROR")
        }
    }
    static async findAutenticatedUser({ username, email, password }){
        try {
  
            const db = getDB()
            const collection = db.collection('users')

            const existingUser = await this.findExistingUser({username, email})

            if(!existingUser) return null

            const isMatch = await bcrypt.compare(password, existingUser.password)
            
                if (isMatch ) {
                    return existingUser
                }
            return null

        } catch(error) {
            throw new Error("DATABASE_ERROR")
        }
    }

    static async getAllUser({page, LIMIT, user}) {

        const db = getDB()
        const collection = db.collection('users')

 
        const offset = (page - 1) * LIMIT

        const users = await collection.find({
            username: { $ne: user.username },
            role: { $ne: 'superadmin' }
            })
            .project({password: 0})
            .skip(offset)
            .limit(LIMIT)
            .toArray()

        const totalUsers = await collection.countDocuments(
            {username: { $ne: user.username }}
        )


        return {
            offset,
            totalUsers,
            users,
        }
    }

    static async getUserById(id) {
        const db = getDB()
        const collection = db.collection('users')

        if (!ObjectId.isValid(id)) {
                throw new Error("NO_VALID_ID")
            }

        const _id = new ObjectId(id)    
        const user = await collection.findOne(_id)

        return user
    }

    static async createUser({ username, password, email }) {
        const existingUser = await this.findExistingUser({ username, email })

        if (existingUser) {
                if (existingUser.username === username) throw new Error('USERNAME_TAKEN');
                if (existingUser.email === email) throw new Error('EMAIL_TAKEN');
            } 

        const db = getDB()
        const collection = db.collection('users')    
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await collection.insertOne({
                username, 
                password: hashedPassword, 
                email, 
                role: "user"
        })  
        
        return {
            id: newUser.insertedId,
            username,
            email,
            role: "user"
        }
        
           
    }   

    static async updateUser(body, id) {
        const db = getDB()
        const collection = db.collection('users')

        const user = await UserModel.getUserById(id)

        const userUpdated = await collection.findOneAndUpdate(
            { _id: new ObjectId(id)},
            { $set: body }, 
            { returnDocument: 'after', projection: { password: 0 } })

        return userUpdated
    }
}  

