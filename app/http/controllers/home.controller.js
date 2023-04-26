const { uniqueNamesGenerator, adjectives, names } = require('unique-names-generator');
const { UserModel } = require('../../models/user.model');
const { ChatModel } = require('../../models/chat.model');
const createHttpError = require('http-errors');

class HomeController {
    async index(req, res, next) {
        try {
            if(req.user) {
                const chats = await ChatModel.find({ users: { $in: req.user._id } }).populate('users')
                if(!chats) throw createHttpError.NotFound('چتی یافت نشد.')
                return res.render('index.ejs', { nameId: req.user.nameId, chats })
            } else {
                const nameId = uniqueNamesGenerator({
                    dictionaries: [names, adjectives],
                    length: 2
                })
                const newUser = await UserModel.create({ nameId })
                if(!newUser) throw createHttpError.InternalServerError('خطای سرور')
                req.user = newUser
                return res.render('index.ejs', { nameId, chats: [] })
            }
        } catch (error) {  
            next(error)
        }
    }
}

module.exports = {
    HomeController: new HomeController()
}