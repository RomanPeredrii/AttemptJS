
let setName = (socket) => {
    let name = document.querySelector('#name');
    //console.log(name.value.length);
    if (name.value.length > 1) {
        //  console.log(name.value);
        socket.emit('identify', name.value);
        messageButton.disabled = false;
        setNameButton.disabled = true;
    }
    else alert('INCORRECT USER NAME');

};


let sendMessage = (socket) => {
    let message = document.querySelector('#message');
    if (message.value.length > 1) {
        socket.emit('userMessage', message.value);
        message.value = '';
    }
    else alert('EMPTY MESSAGE AREA')

};


export { sendMessage };
export { setName };