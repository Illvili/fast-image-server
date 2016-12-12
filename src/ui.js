const { remote, clipboard } = require('electron')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const Vue = require('../lib/vue.js')
const $ = require('../lib/jquery-3.1.1.min.js')

let config = remote.getCurrentWindow().__config__

var type2ext = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif'
}

var app = new Vue({
    el: '#app',
    data: {
        config,
        fileList: []
    },
    ready: function () {
        var fl = localStorage.getItem('__filelist__')
        if (!!fl) {
            this.fileList = JSON.parse(fl)
        }
    },
    watch: {
        fileList: function (val) {
            localStorage.setItem('__filelist__', JSON.stringify(val))
        }
    }
})

function storeImage(image, type) {
    var buffer

    if (typeof image == 'string') {
        buffer = new Buffer(image.slice(13 + type.length), 'base64')
    } else {
        buffer = new Buffer(image)
        type = 'image/png'
    }

    var filename = crypto.randomBytes(12).toString('hex') + '.' + type2ext[type]
    fs.writeFileSync(path.join(config.cache, filename), buffer)

    return filename
}

$('body').on('paste', function (e) {
    // ! current version the image data from clipboard is broken
    // ! use electron clipboard

    // var items = e.originalEvent.clipboardData.items
    // if (!items) {
    //     return
    // }

    // Array.prototype.forEach.call(items, item => {
    //     if (item.kind == 'file') {
    //         var blob = item.getAsFile()
    //         var reader = new FileReader()
    //         var type = item.type

    //         reader.onload = function (e) {
    //             var img = new Image()
    //             img.src = e.target.result
    //             $('#latest-file .result').empty().append(img)

    //             var fname = storeImage(e.target.result, type)
    //             app.fileList.push(fname)
    //         }
    //         reader.readAsDataURL(blob)
    //     }
    // })

    var blob = clipboard.readImage()
    if (!blob) {
        return
    }

    var img = new Image()
    img.src = blob.toDataURL()
    $('#latest-file .result').empty().append(img)

    var fname = storeImage(blob.toPNG())
    app.fileList.push(fname)
})
