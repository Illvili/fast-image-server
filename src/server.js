const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs')

function startServer(port, cache) {
    return http.createServer(function (request, response) {
        var uri = url.parse(request.url),
            filename = path.join(cache, uri.pathname)

        fs.stat(filename, function (err, stats) {
            if (err || !stats.isFile()) {
                response.writeHead('404', { 'Content-Type': 'text-plain' })
                response.write(err + '\n')
                response.end()

                return
            }

            fs.readFile(filename, function (err, file) {
                response.writeHead('200', { 'Access-Control-Allow-Origin': '*' })
                response.write(file)
                response.end()
            })
        })
    }).listen(port)
}

module.exports = { startServer }
