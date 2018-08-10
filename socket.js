const log = console.log;
var http = require('http');
//const io = require('socket.io')
var clients = [];
var clientsFront = [];
const fs = require('fs');
fs.openSync('userData.txt', 'w');



/*moment.JS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/
let sysServDate = '';
let nowDate = new Date();
sysServDate += nowDate.getHours() + ':';
sysServDate += nowDate.getMinutes() + ' ';
sysServDate += nowDate.getDate() + '.';
sysServDate += (nowDate.getMonth() + 1) + '.';
sysServDate += nowDate.getFullYear();
/*moment.JS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/

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

    console.log('I get message from ', client.nickname, '-', message, sysServDate);
    let parcel = {
      message,
      nickname: client.nickname,
      sysServDate,

    }
    client.emit('message', parcel);
    client.broadcast.emit('message', parcel);
    let forAppendToFile = parcel.nickname + ': ' + parcel.message + ' ' + parcel.sysServDate + '\n';
    fs.appendFileSync('userData.txt', forAppendToFile);
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