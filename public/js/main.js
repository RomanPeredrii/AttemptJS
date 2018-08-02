
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

let socket = io.connect('http://localhost:3001');

socket.on('onConnect', (message) => {
    //console.log(message);
    socket.emit('userMessage', 'SO WERE ARE HERE');
});

let setName = () => {
    let name = document.querySelector('#name');
    console.log(name.value.length);
    if (name.value.length > 1) {
        console.log(name.value);
        socket.emit('identify', name.value);
    }
    else alert('UNCORRECT USER NAME');

};

socket.on('clientList', (clientList) => {
    clientList.map((client) => {
        if (client.name === undefined) client.name = 'guest'; console.log(client.name)
    });
    clientList.innerHTML = `<div>' '</div>`;
    clientList.map((client) => clientsList.innerHTML += `<div>${client.name}</div>`);
})



let sendMessage = () => {
    let message = document.querySelector('#message');
    console.log(message.value.length);
    if (message.value.length > 1) {
        //console.log(message.value);
        socket.emit('userMessage', message.value);
    }
    else alert('EMPTY MESSAGE AREA');

};

socket.on('message', (parcel) => {
    log('MESSAGE', parcel.nickname, ' ', parcel.message);
    allMessages.innerHTML += `<div>${parcel.nickname}:  ${parcel.message}</div>`;
});
