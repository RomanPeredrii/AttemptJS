
const log = console.log;

let setName = (socket) => {
    let name = document.querySelector('#name');
    //console.log(name.value.length);
    if (name.value.length > 1) {
        //  console.log(name.value);
        socket.emit('identify', name.value);
        messageButton.disabled = false;
        setNameButton.disabled = true;
        files.disabled = false;
    }
    else alert('INCORRECT USER NAME');

};


let sendMessage = (socket) => {
   
    log('SM', socket);
    
    let message = document.querySelector('#message');
    if (message.value.length > 1) {
        socket.emit('userMessage', message.value);
        message.value = '';
    }
    else alert('EMPTY MESSAGE AREA')

};

let putSmile = (smile) => {
    let message = document.querySelector('#message');
    message.value += smile;
};

export { sendMessage };
export { setName };
export { putSmile };