const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
var fs = require('fs');
var cron = require('cron');
//var email = require('./mail.js');
//var webshot = require('webshot');
var _u = require('./r-utils.js');
//var log = require('electron-log');
 


//require('electron-reload')(__dirname);


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 600, height: 600, backgroundColor: '#fff', title: '크롤맨',
                          webPreferences: {
                            devTools: true
                          }})

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.webContents.on('did-finish-load', function() {
    /*
    fs.readFile(__dirname+ '/bower_components/OnsenUI/css/onsenui.css', "utf-8", function(error, data) {
      if(!error){
        //var formatedData = data.replace(/\s{2,10}/g, ' ').trim()
        win.webContents.insertCSS(data)
      }
    })
    fs.readFile(__dirname+ '/bower_components/OnsenUI/css/onsen-css-components.css', "utf-8", function(error, data) {
      if(!error){
        //var formatedData = data.replace(/\s{2,10}/g, ' ').trim()
        win.webContents.insertCSS(data)
      }
    })
    
    fs.readFile(__dirname+ '/bower_components/OnsenUI/js/onsenui.js', "utf-8", function(error, data) {
      if(!error){
        //var formatedData = data.replace(/\s{2,10}/g, ' ').trim()
        win.webContents.insertCSS(data)
      }
    })
    fs.readFile(__dirname+ '/jquery.playSound.js', "utf-8", function(error, data) {
      if(!error){
        //var formatedData = data.replace(/\s{2,10}/g, ' ').trim()
        win.webContents.insertCSS(data)
      }
    })
    */
  })

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})


// In main process.
const {ipcMain} = require('electron')


ipcMain.on('asynchronous-message', (event, url, key1, key2) => {
  //console.log(arg)  // prints "ping"
  event.sender.send('asynchronous-reply', 'pong')
})

ipcMain.on('crawl-message', (event, url, key1, key2) => {

  var req_obj = {
              // 여기서 charset 설정해야 한다.
              charset : 'utf-8',
              urls : url,
              // href태그를 가져온 후에 looping을 돈다
              scrapDomHref : '',
              // 해당 dom을 search
              searchClass : ['#topWrap > div.topInfo > h2',
                             '.curPrice'
                              

              ], 
              /*
              searchClass : ['form[name="ArticleList"] > .board-box > .board-list > .aaa:nth-child(1)',
                              'form[name="ArticleList"] > .list-count:nth-child(1)'
                            ], 
*/
              banWord : '',   
              // 가져온 데이터에서 없앨 데이터 reg
              deleteReg : '',
              // 가져온 데이터에서 해당 태그만 두고 다 없앤다.
              deleteAlltagWithout : 'br',
              // 
              changeImgUrl : '',

              maxLimit : '5'
          };

  _u.r([req_obj.urls], req_obj, 
      function(data){


      if( data == null ) {
        event.sender.send('crawl-reply', 'no data');
      } else {


      var data = data[req_obj.urls];

      event.sender.send('crawl-reply', data)
      /*
      if( stockPrice  >= 500000 ) {

        shot(req_obj.urls);
        console.log('####take photo#####')
      } else {
        console.log('#### no photo#####')
      }*/

    
    }
  }); 

})



ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg)  // prints "ping"
  event.returnValue = 'pong'
})