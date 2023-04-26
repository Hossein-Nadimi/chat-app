const { UserModel } = require("../../models/user.model")

const loginMiddleware = async (req, res, next) => {
    try {
        const nameId = req.cookies['nameId']
        if(nameId) {
            const user = await UserModel.findOne({ nameId })
            req.user = user
        }
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = {
    loginMiddleware
}