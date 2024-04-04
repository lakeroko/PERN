const ApiError = require("../error/ApiError")
const {User} = require("../models/models")

const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")



class UserController {
    static generateJwt(id, username) {
        return jwt.sign(
            {id, username},
            process.env.SECRET_KEY,
            {expiresIn: '24h'}
        )
    }

    async registration(req, res, next){
        const {username, password} = req.body

        if(!username || !password){
            return next(ApiError.badRequest("username or password not found"))
        }

        console.log(username)
        const candidate = await User.findOne({where: {username}})

        if (candidate) {
            console.log("юзер есть в бд")
            return next(ApiError.badRequest('Пользователь с таким username уже существует'))
        }

        console.log("юзера нет в бд")
        const hashPassword = bcrypt.hashSync(password, 5);

        const user = await User.create({username, password: hashPassword})
        const token = UserController.generateJwt(user.id, user.username)
        return res.json({token})
    }

    async login(req, res){
        const {username, password} = req.body
        const user = await User.findOne({where: {username}})

        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }

        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        const token = UserController.generateJwt(user.id, user.username)
        return res.json({token})
    }

    async check(req, res, next){
        const {id} = req.query

        if(!id){
            return next(ApiError.badRequest("Не задан id"))
        }
        res.json(id)
    }
}

module.exports = new UserController()