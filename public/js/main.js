const log = console.log;

import {check} from './uploadFiles.js';

check();



const allMessages = document.querySelector('.allMessages');
const clientsList = document.querySelector('.clientsList');
const messageButton = document.querySelector('#messageButton');
const socket = io.connect('http://localhost:3001');
const setNameButton = document.querySelector('#setNameButton');
const message = document.querySelector('#message');

import {setName} from './chatFunction.js';

setNameButton.addEventListener('click', () => setName(socket));

messageButton.disabled = true;

socket.on('onConnect', (message) => {
    socket.emit('userMessage', 'SO WERE ARE HERE');
});

socket.on('clientList', (clientList) => {
  
    clientsList.innerHTML = `<div></div>`;

    clientList.map((client) => {
        if (client.name === undefined) client.name = 'guest';
        log(client.name);
        clientsList.innerHTML += `<div>${client.name}</div>`;
    });

    
});

socket.on('message', (parcel) => {
    log('MESSAGE', parcel.nickname, ' ', parcel.message);
    allMessages.innerHTML += `<div>${parcel.dateTimeForChat} - ${parcel.nickname}: <br>  ${parcel.message} </div>`;

}); 
/*
let sendMessage = () => {

    if (message.value.length > 1) {
        socket.emit('userMessage', message.value);
        message.value = '';
    }
    else alert('EMPTY MESSAGE AREA')

};

*/

const smiles = document.querySelector('.smiles');

'😀 😁 😂 🤣 😃 😄 😅 😆 😉 😊 😋 😎 😍 😘 😗 😙 😚 ☺️ 🙂 🤗 🤩 🤔 🤨 😐 😑 😶 🙄 😏 😣 😥 😮 🤐 😯 😪 😫 😴 😌 😛 😜 😝 🤤 😒 😓 😔 😕 🙃 🤑 😲 ☹️ 🙁 😖 😞 😟 😤 😢 😭 😦 😧 😨 😩 🤯 😬 😰 😱 😳 🤪 😵 😡 😠 🤬 😷 🤒 🤕 🤢 🤮 🤧 😇 🤠 🤡 🤥 🤫 🤭 🧐 🤓 😈 👿 👹 👺 💀 👻 👽 '
    .split(' ')
    .map((smile) => smiles.innerHTML += '<div class="smile">' + smile + '</div>');
const smilesAll = document.querySelector('.smiles');

let smileArray = Array.from(smilesAll);
smileArray.map((ell) => log(ell));

//for(let i in smileArray) {log(i)}; 
//let lengthSmiles = smilesAll.length;
//log("lengthSmiles");
//log(smilesAll);


