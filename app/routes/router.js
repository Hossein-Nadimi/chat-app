const { chatRoutes } = require('./chat.router')
const { homeRoutes } = require('./home.routes')

const router = require('express').Router()

router.use('/', homeRoutes)
router.use('/chat', chatRoutes)

module.exports = {
    allRoutes: router
}