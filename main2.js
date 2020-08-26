const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')

function createWindow () {
  // ブラウザウインドウの作成
  win = new BrowserWindow({width: 800, height: 600})

  // アプリの index.html を読み込む
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))


  win.webContents.openDevTools();
  // win.loadFile("index.html");

  //このウインドウが閉じられたときの処理
  win.on('closed', () => {
      win = null
  })
}

app.on('ready', createWindow)

//アクティブになったとき（MacだとDockがクリックされたとき）
app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})
