const {Router} = require("express")
const userRouter = require("../controllers/userController")

const router = new Router()

router.post("/registration", userRouter.registration)
router.post("/login", userRouter.login)
router.get("/auth", userRouter.check)

module.exports = router