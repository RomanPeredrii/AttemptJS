//import { sendMessage } from "./chatFunction";



const log = console.log;
/*
function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.dataTransfer.files; // FileList object.

  // files is a FileList of File objects. List some properties.
  var output = [];
  for (var i = 0, f; f = files[i]; i++) {
    output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
      f.size, ' bytes, last modified: ',
      f.lastModifiedDate.toLocaleDateString(), '</li>');
  }
  document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
}

*/

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

// Setup the dnd listeners.
var dropZone = document.getElementById('message');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);


function handleFileSelect(e, socket) {
  var files = e.target.files; // FileList object
  
  // Loop through the FileList and render image files as thumbnails.
  for (var i = 0, f; f = files[i]; i++) {
    log(files);
    // Only process image files.
    if (!f.type.match('image.*')) continue;
    let slice = f.slice(0, 1000);
    var reader = new FileReader();
    var binaryReader = new FileReader();   // for read binary data
    binaryReader.readAsBinaryString(slice);
    socket.emit('userMessage', 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
    binaryReader.onload = (function (f, socket) {
      return function (e, socket) {

        log('file', e);

        log('OUTPUT', e.target.result);

       

        //let arr = new Int8Array(e.target.result);
       // log(arr);
        //let output = JSON.stringify(arr, null, '  ');
      }

    })(f, e, socket);


    reader.readAsDataURL(f);
    reader.onload = (function (f) {
      return function (e) {
        let allMessages = document.querySelector('.allMessages');
        allMessages.innerHTML += `<img src=" ${e.target.result} " title=" ${escape(f.name)}"/>`
        //log('target', e.target.result);
        //log('file', f);
        //log(escape(f.name));
      }
    })(f, e);






    /*
    (f, event) => {
      allMessages += `<img class="thumb" src=" ${event.target.result} "title=" ${escape(f.name)}"/>`
      log('target', event.target.result);
      log('file', f);
      log(escape(f.name));
  
    };*/

    // Read in the image file as a data URL.

  }
}


export { handleFileSelect }