const log = console.log;


const allMessages = document.querySelector('.allMessages');
const clientsList = document.querySelector('.clientsList');
const messageButton = document.querySelector('#messageButton');
const socket = io.connect('http://localhost:3001');
const setNameButton = document.querySelector('#setNameButton');
const message = document.querySelector('#message');

import { setName } from './chatFunction.js';
setNameButton.addEventListener('click', () => setName(socket));

import { sendMessage } from './chatFunction.js';
messageButton.addEventListener('click', () => sendMessage(socket));

import { putSmile } from './chatFunction.js';

import { handleFileSelect } from './uploadFiles.js';



messageButton.disabled = true;
files.disabled = true;

socket.on('onConnect', (message) => {


    // socket.emit('userMessage', 'SO WERE ARE HERE');
    document.getElementById('files').addEventListener('change', (() => {
        return (e, socket) => { handleFileSelect(e, socket) }
    })(socket));




});

socket.on('clientList', (clientList) => {
    clientsList.innerHTML = `<div></div>`;
    clientList.map((client) => {
        if (client.name === undefined) client.name = 'guest';
        //log(client.name);
        clientsList.innerHTML += `<div>${client.name}</div>`;
    });
});

socket.on('message', (parcel) => {
    log('MESSAGE', parcel.nickname, ' ', parcel.message);
    allMessages.innerHTML += `<div>${parcel.dateTimeForChat} - ${parcel.nickname}: <br>  ${parcel.message} </div>`;
});
const smiles = document.querySelector('.smiles');
let smileArray = '😀 😁 😂 🤣 😃 😄 😅 😆 😉 😊 😋 😎 😍 😘 😗 😙 😚 🙂 🤗 🤩 🤔 🤨 😐 😑 😶 🙄 😏 😣 😥 😮 🤐 😯 😪 😫 😴 😌 😛 😜 😝 🤤 😒 😓 😔 😕 🙃 🤑 😲 ☹️ 🙁 😖 😞 😟 😤 😢 😭 😦 😧 😨 😩 🤯 😬 😰 😱 😳 🤪 😵 😡 😠 🤬 😷 🤒 🤕 🤢 🤮 🤧 😇 🤠 🤡 🤥 🤫 🤭 🧐 🤓 😈 👿 👹 👺 💀 👻 👽'
    .split(' ')
    .map((smile) => smiles.innerHTML += '<div class="smile">' + smile + '</div>');
let smilesAllNodeList = document.querySelectorAll('.smiles');
//log(smilesAllNodeList[0].childNodes.length);
for (let i in smileArray) {
    // log(smilesAllNodeList[0].childNodes.item(i))
    var smileFromNodeList = smilesAllNodeList[0].childNodes.item(i).firstChild.data;
    var smileNodeList = smilesAllNodeList[0].childNodes.item(i);
    smileNodeList.addEventListener('click', (smileFromNodeList) => {
        log(smileFromNodeList.target.childNodes[0].data);
        putSmile(smileFromNodeList.target.childNodes[0].data);

        // log(smileFromNodeList.path[0].outerText);
        // putSmile(smileFromNodeList.path[0].outerText);
        // CHROME & FIREFOX have different objects!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // log(smileFromNodeList.explicitOriginalTarget.data);
        // putSmile(smileFromNodeList.explicitOriginalTarget.data);
    })
};


