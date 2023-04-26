const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const socketIO = require('socket.io')
const createError = require('http-errors')
const cookieParser = require('cookie-parser')
const { allRoutes } = require('./routes/router')
const { socketHandler } = require('./socket.io')

module.exports = class Application {
    #app = express()
    #DB_URI
    #PORT
    constructor(PORT, DB_URI) {
        this.#PORT = PORT
        this.#DB_URI = DB_URI
        this.configDatabase()
        this.configApplication()
        this.createServer()
        this.createRoutes()
        this.errorHandler()
    }

    configApplication() {
        this.#app.use(cors())
        this.#app.use(morgan('dev'))
        this.#app.use(express.json())
        this.#app.use(express.urlencoded({ extended: true }))
        this.#app.use(express.static(path.join(__dirname, '..', 'public')))
        this.#app.set('view engine', 'ejs')
        this.#app.set('views', 'views')
        this.#app.use(cookieParser(process.env.COOKIE_SECRET_KEY))
    }

    createServer() {
        const http = require('http')
        const server = http.createServer(this.#app)
        const io = socketIO(server, { pingTimeout: 60000, cors: { origin: '*' } })
        socketHandler(io)
        server.listen(this.#PORT, () => {
            console.log(`Server is running on > http://localhost:${this.#PORT}`)
        })
    }

    configDatabase() {
        try {
            mongoose.connect(this.#DB_URI)
            console.log('Connected to MongoDB!')
        } catch (error) {
            console.log(error.message)
            process.exit(0)
        }
    }

    createRoutes() {
        this.#app.use(allRoutes)
    }

    errorHandler() {
        // 404 handler
        this.#app.use((req, res, next) => {
            next(createError.NotFound(('صفحه مورد نظر شما یافت نشد.')))
        })

        // 500 handler
        this.#app.use((error, req, res, next) => {
            const serverError = createError.InternalServerError()
            const statusCode = error?.statusCode || serverError.statusCode
            const message = error?.message || serverError.message
            return res.status(statusCode).json({
                errors: {
                    status: 'error',
                    message
                }
            })
        })
    }
}