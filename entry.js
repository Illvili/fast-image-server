const config = require('./src/config')
const path = require('path')
const { startServer } = require('./src/server')
const { startUI } = require('./src/win')

config.cache = path.resolve(config.cache)

startServer(config.port, config.cache)
startUI(config)
