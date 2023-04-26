const createHttpError = require("http-errors")
const { ChatModel } = require("../../models/chat.model")
const { UserModel } = require("../../models/user.model")

class ChatController {
    async chat(req, res, next) {
        try {
            const { _id: senderId, nameId: senderNameId } = req.user
            const receiverNameId = req.query.receiver
            const receiver = await UserModel.findOne({ nameId: receiverNameId })
            if(!receiver) throw createHttpError.NotFound('مخاطب مورد نظر یافت نشد.')

            const existingChat = await ChatModel.findOne({
                $and: [
                    { users: { $elemMatch: { $eq: senderId } } },
                    { users: { $elemMatch: { $eq: receiver._id } } }
                ]
            }).populate([{ path: 'messages', populate: 'sender' }])

            if(existingChat) {
                return res.render('chat.ejs', { sender: senderNameId, receiver: receiverNameId, chat: existingChat })
            }

            const chat = await ChatModel.create({
                users: [senderId, receiver._id],
                messages: []
            })

            if(!chat) throw createHttpError.InternalServerError('خطای سرور')

            return res.render('chat.ejs', { sender: senderNameId, receiver: receiverNameId, chat })
        } catch (error) {
            next(error)
        }
    }

    async sendMessage(req, res, next) {
        try {
            const { id: chatId } = req.params
            const chat = await ChatModel.updateOne({ _id: chatId }, {
                $push: {
                    messages: {
                        sender: req.user._id,
                        message: req.body.message
                    }
                }
            })
            if(chat.modifiedCount == 0) throw createHttpError.InternalServerError('خطای سرور')
            return res.json({ status: 'OK' })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = {
    ChatController: new ChatController()
}