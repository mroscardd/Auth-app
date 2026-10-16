
const bcrypt = require('bcrypt')
const { getDB } = require('../config/database')


class UserModel {
    
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

    static async getAllUser() {
        const db = getDB()
        const collection = db.collection('users')

        const users = await collection.find().project({password: 0}).toArray()
        return users
    }

    static async getUserById(id) {
        const db = getDB()
        const collection = db.collection('users')

        const user = await collection.findOne(id)
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

    static async updateUser({ username, password, email }) {
        const db = getDB()
        const collection = db.collection('users')
    }
}    

module.exports = UserModel