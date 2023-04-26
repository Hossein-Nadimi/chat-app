const Application = require('./app/server')
require('dotenv').config()
new Application(process.env.APPLICATION_PORT, process.env.DB_URI)