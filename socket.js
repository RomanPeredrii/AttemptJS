const log = console.log;
const http = require('http');
//const io = require('socket.io')
var clients = [];
var clientsFront = [];

const moment = require('moment');
var dateTimeForChat = moment().locale('us').format('MMMM Do YYYY, hh:mm:ss a')
var logFileName = './logs/' + moment().format('DD_MM_YY_hh_mm')+'.txt';

const fs = require('fs');
fs.openSync(logFileName, 'w');

log(dateTimeForChat);

var serverIo = http.createServer();
var io = require('socket.io')(serverIo);

io.on('connection', function (client) {
  clients.push(client);

  client.emit('onConnect', 'Connected');
  client.on('event', function (data) { });
  client.on('disconnect', function () {
    clientsListRefresh();
  });
  client.on('userMessage', (message) => {

    if (client.nickname === undefined) client.nickname = 'guest';

    console.log('I get message from ', client.nickname, '-', message, dateTimeForChat);
    let parcel = {
      message,
      nickname: client.nickname,
      dateTimeForChat,

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
});
serverIo.listen(3001);

module.exports = {};