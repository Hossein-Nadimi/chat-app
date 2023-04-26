const { ChatController } = require('../http/controllers/chat.controller')
const { loginMiddleware } = require('../http/middlewares/login')

const router = require('express').Router()

router.get('/', loginMiddleware, ChatController.chat)
router.post('/:id', loginMiddleware, ChatController.sendMessage)

module.exports = {
    chatRoutes: router
}