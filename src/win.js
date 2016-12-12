const fs = require('fs')
const url = require('url')
const path = require('path')

const { app, BrowserWindow } = require('electron')

let win
function createWindow (config) {
    win = new BrowserWindow({ width: 800, height: 600 })

    win.__config__ = config

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'ui.html'),
        protocol: 'file:',
        slashes: true
    }))

    win.webContents.openDevTools()

    win.on('closed', () => {
        win = null
    })
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win == null) {
        createWindow()
    }
})

function startUI(config) {
    if (app.isReady()) {
        createWindow(config)
    } else {
        app.on('ready', _ => {
            createWindow(config)
        })
    }
}

module.exports = {
    startUI
}
