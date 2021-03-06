const log = console.log;
const http = require('http');
const moment = require('moment');
var clients = [];
var clientsFront = [];

var dateTime = () => { return (moment().locale('us').format('MMMM Do YYYY, hh:mm:ss a')) }

let hh = moment().format('hh');
if (moment().format('a') === 'pm') {
  hh = +hh + 12;
};

var logFileName = './logs/' + moment().format('YY_MM_DD_') + hh + moment().format('_mm') + '.txt';
//log(logFileName);
const fs = require('fs');
//fs.openSync(logFileName, 'w');
log(dateTime());

var serverIo = http.createServer();
var io = require('socket.io')(serverIo);

io.on('connection', function (client) {
  clients.push(client);
  //fs.openSync('./buff/'+ client.id, 'w');
  //fs.writeFile('./public/videoBuff','',() => {});
  client.emit('onConnect', 'Connected');
  /********************VIDEO IMG*******************/
  client.on('imgBase64', function (imageBase64) {
    client.broadcast.emit('streamImg', imageBase64);
    client.emit('streamImg', imageBase64);
  });
  /****************************************
  client.on('blob', function (data) {
    //log('CLIENT', client.id);
    //fs.appendFile('./public/videoBuff', data, () => {});
    log('data: ', data);
    client.broadcast.emit('stream', data);
    client.emit('stream', data);
  });
  /****************************************/
  /***********************AUDIO***************************/
  client.on('stream', function (audioData) {
    log('AUDIO', audioData);
    //fs.appendFile('./public/videoBuff', data, () => {});
    //log('data: ', data);
    client.broadcast.emit('audioStream', audioData);
    //client.emit('audioStream', audioData);
  });
  /*******************************************************/

  client.on('disconnect', function () {
    clientsListRefresh();
  });

  var dateTimeForChat = dateTime();
  client.on('userMessage', (message) => {
    if (client.nickname === undefined) client.nickname = 'guest';

    console.log('I get message from ', client.nickname, '-', message, dateTimeForChat);
    
    let parcel = {
      message,
      nickname: client.nickname,
      dateTimeForChat
    }
    client.emit('message', parcel);
    client.broadcast.emit('message', parcel);
    let forAppendToFile = parcel.nickname + ': ' + parcel.message + ' - ' + parcel.dateTimeForChat + '\n';
    fs.appendFileSync(logFileName, forAppendToFile);
    clientsListRefresh();
  })

  client.on('identify', function (name) {
    client.nickname = name;
    clientsListRefresh();

  });

  let clientsListRefresh = () => {
    ioClients = io.sockets.clients();
    clientsFront = [];
    Object
      .entries(ioClients.connected)
      .map((ioClient) => {
        clientsFront.push({
          id: ioClient[0],
          name: ioClient[1].nickname
        });
      });
    client.emit('clientList', clientsFront);
    client.broadcast.emit('clientList', clientsFront);
  };

  var buffFileName = 'buffers/' + moment().format('YYMMDD') + hh + moment().format('mmssSSS') + '.jpeg';
  log(buffFileName);

  client.on('uploadFile', (binaryFile) => {
    var base64Data = binaryFile.replace(/^data:image\/jpeg;base64,/, "");
    fs.writeFile('./public/' + buffFileName, base64Data, 'binary', function (err) {
      //fs.writeFile("buff.jpeg", base64Data, 'base64', function (err) {
      if (err) {
        log(err); throw err
      }
      log('Saved!')
      let parcel = {
        message : `<a href ="${buffFileName}" target="_blank"> link </a>`,
        nickname: client.nickname,
        dateTimeForChat,
      }
      let forReciveFile = parcel.nickname + ': ' + parcel.message + ' - ' + parcel.dateTimeForChat + '\n'
      client.broadcast.emit('message', parcel);

    });
  });
});
serverIo.listen(3001);

module.exports = {};