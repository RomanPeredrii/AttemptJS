
let setName = (socket) => {
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

export {setName};