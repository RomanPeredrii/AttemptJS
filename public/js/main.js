
/*console.log('The main js');
let myNextAttempt = async function () {
    console.log('inFunction');
    try {
        let fromGit = await fetch('/api');
        console.log(fromGit);
        let fromGitNext = fromGit.json();
        let fromGitNext2 = await fromGitNext;
        console.log(fromGitNext2);
    }
    catch (error) {
        console.log(error);
    }
}
myNextAttempt(); */
//setName.addEventListener('click', () => {
//alert();
//});

const log = console.log;
const allMessages = document.querySelector('.allMessages');
const clientsList = document.querySelector('.clientsList');
const messageButton = document.querySelector('#messageButton');
const socket = io.connect('http://localhost:3001');
const setNameButton = document.querySelector('#setNameButton');
const message = document.querySelector('#message');


messageButton.disabled = true;
/*
socket.on('onConnect', (message) => {
    socket.emit('userMessage', 'SO WERE ARE HERE');
});*/

let setName = () => {
    let name = document.querySelector('#name');
    //console.log(name.value.length);
    if (name.value.length > 1) {
        //  console.log(name.value);
        socket.emit('identify', name.value);
        messageButton.disabled = false;
        setNameButton.disabled = true;
    }
    else alert('UNCORRECT USER NAME');

};


socket.on('clientList', (clientList) => {
  
    clientsList.innerHTML = `<div></div>`;

    clientList.map((client) => {
        if (client.name === undefined) client.name = 'guest';
        log(client.name);
        clientsList.innerHTML += `<div>${client.name}</div>`;
    });

    
});


let sendMessage = () => {

    if (message.value.length > 1) {
        socket.emit('userMessage', message.value);
        message.value = '';
    }
    else alert('EMPTY MESSAGE AREA')

};

socket.on('message', (parcel) => {
    log('MESSAGE', parcel.nickname, ' ', parcel.message);
    allMessages.innerHTML += `<div>${parcel.dateTimeForChat} - ${parcel.nickname}: <br>  ${parcel.message} </div>`;

});

let putSmile = (smile) => {
    log(smile);
    message.value += smile;
}
