const { HomeController } = require('../http/controllers/home.controller')
const { loginMiddleware } = require('../http/middlewares/login')

const router = require('express').Router()

router.get('/', loginMiddleware, HomeController.index)

module.exports = {
    homeRoutes: router
}