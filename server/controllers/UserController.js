const ApiError = require("../error/ApiError")
const {User} = require("../models/models")

const bcrypto = require("bcrypto")
const jwt = require("jsonwebtoken")

class UserController {
    static generateJwt (id, email) {
        return jwt.sign(
            {id, email},
            process.env.SECRET_KEY,
            {expiresIn: '24h'}
        )
    }

    async registration(req, res, next){
        const {email, password} = req.body
        if(!email || !password){
            return next(ApiError.badRequest("email or password not found"))
        }

        console.log(email)
        const candidate = await User.findOne({where: {email}})

        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }

        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email, password: hashPassword})
        const token = this.generateJwt(user.id, user.email)
        return res.json({token})
    }

    async login(req, res){

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