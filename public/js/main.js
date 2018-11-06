const log = console.log;


const allMessages = document.querySelector('.allMessages');
const clientsList = document.querySelector('.clientsList');
const messageButton = document.querySelector('#messageButton');
//const socket = io.connect('http://188.230.34.177:3001');
const socket = io.connect('http://localhost:3001');
const setNameButton = document.querySelector('#setNameButton');
const message = document.querySelector('#message');
const videoButton = document.querySelector('#videoButton');
const soundButton = document.querySelector('#soundButton');
const soundReceiveButton = document.querySelector('#soundReceiveButton');
window.socket = socket;

import { setName } from './chatFunction.js';
setNameButton.addEventListener('click', () => setName(socket));

import { VideoConnection } from './webRTC.js';
videoButton.addEventListener('click', () => VideoConnection());

import { SoundConnection } from './webRTC.js';
soundButton.addEventListener('click', () => SoundConnection());

import { getVideoStream } from './webRTC.js';
getVideoStream();

import { getAudioStream } from './webRTC.js';
soundReceiveButton.addEventListener('click', () => getAudioStream());

import { sendMessage } from './chatFunction.js';
messageButton.addEventListener('click', () => sendMessage(socket));

import { putSmile } from './chatFunction.js';

//import { handleFileSelect } from './uploadFiles.js';
import { filesExecute } from './uploadFiles.js';
//document.getElementById('files').addEventListener('change', (() => { return (e, socket) => { filesExecute(e, socket); log('MAIN', socket) } })(socket));

document.getElementById('files').addEventListener('change', (e) => {
  //  log('MAIN_EVENT', e); 
 //   log('MAIN_SOCKET', socket)

 filesExecute(e, socket); 

});


//messageButton.disabled = true;
//files.disabled = true;

socket.on('onConnect', () => { socket.emit('userMessage', 'SO WERE ARE HERE')});

socket.on('clientList', (clientList) => {
    clientsList.innerHTML = `<div></div>`;
    clientList.map((client) => {
        if (client.name === undefined) client.name = 'guest';
        clientsList.innerHTML += `<div>${client.name}</div>`;
    });
});

socket.on('message', (parcel) => {
    log('MESSAGE', parcel.nickname, ' ', parcel.message);
    allMessages.innerHTML += `<div>${parcel.dateTimeForChat} - ${parcel.nickname}: <br>  ${parcel.message} </div>`;
});
const smiles = document.querySelector('.smiles');
let smileArray = '😁 😂 😃 😄 😅 😆 😉 😊 😋 😎 😍 😘 😚 😐 😶 😏 😣 😥 😪 😫 😌 😜 😝 😒 😓 😔 😲 😖 😞 😤 😢 😭 😨 😩 😰 😱 😳 😵 😡 😠 😷 😇 😈 👿 👹 👺 💀 👻 👽 💩'
    .split(' ')
    .map((smile) => smiles.innerHTML += '<div class="smile">' + smile + '</div>');
let smilesAllNodeList = document.querySelectorAll('.smiles');
for (let i in smileArray) {
    var smileFromNodeList = smilesAllNodeList[0].childNodes.item(i).firstChild.data;
    var smileNodeList = smilesAllNodeList[0].childNodes.item(i);
    smileNodeList.addEventListener('click', (smileFromNodeList) => {
      //  log(smileFromNodeList.target.childNodes[0].data);
        putSmile(smileFromNodeList.target.childNodes[0].data);

        // log(smileFromNodeList.path[0].outerText);
        // putSmile(smileFromNodeList.path[0].outerText);
        // CHROME & FIREFOX have different objects!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // log(smileFromNodeList.explicitOriginalTarget.data);
        // putSmile(smileFromNodeList.explicitOriginalTarget.data);
    })
};