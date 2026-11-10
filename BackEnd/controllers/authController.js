import { UserModel } from '../models/users.js'

const jwtSecret = process.env.JWTSECRET

export class AuthController {

    static async me(req, res) {
        res.status(200).json({user: req.user})
    }

    static async getUsers(req, res) {
        const LIMIT = 10
        const { page, search, role } = req.query
        const user = req.user
            
        try {
            
            const dataUsers = await UserModel.getAllUser({ page, LIMIT, user, search, role })

            const usersShown = dataUsers.users
            const totalUsers = dataUsers.totalUsers
            const totalPages = Math.ceil(dataUsers.totalUsers / LIMIT)

            return res.status(200).json({
                totalUsers,
                totalPages,
                usersShown
            })
        } catch (error) {
            console.error(error)
            return res.status(500).json({message: "error"})
        }
    }

    static async updateRole(req, res) {
        const user_role = req.user.role
        const user_id = req.user._id
        const id = req.params.id
        try{
            
            if (id === user_id) {
                return res.status(409).json({ message: "No puedes modificar tus permisos" })
            }

            const user = await UserModel.getUserById(id)

        
            if (!user) {
                return res.status(404).json({message:"UserId dont exist"})
            }
            if (user_role !== "superadmin" && user.role === "admin") {
                return res.status(403).json({message:"You cant modify admin users"})
            }

            if (user.role === "superadmin") {
                return res.status(409).json({message:"You cant modify superadmin"})
            }

            const userUpdated = await UserModel.updateUser({role: req.body.role}, id)
    
            res.status(200).json({message: "Updated successfully", userUpdated})
        
            } catch (error) {
                console.error(error)
                if (error.message === "NO_VALID_ID") {
                    return res.status(400).json({ message: "UserId dont exist" })
                }
                res.status(500).json({message: "Internal problem"})
            }
    }

     static async deleteUser(req, res){
            try{
                const { id } = req.params
                const deleteUser = await UserModel.deleteUserById(id)
                if (deleteUser.deletedCount != 0) {
                    console.log(deleteUser.deletedCount)
                    return res.status(204).send()
                } 
                return res.status(404).json({message: "Not user in db found"})
            } catch(error){
                console.error(error)
                if (error.message === "NO_VALID_ID") {
                    return res.status(400).json({ message: "UserId dont exist" })
                }
                res.status(500).json({message: "Internal problem"})
            }
        }
    
}

