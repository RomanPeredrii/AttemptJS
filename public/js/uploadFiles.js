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

function filesExecute(e, socket) {

  // log('UF_SOCKET', socket);
  // log('UF_EVENT', e);
  handleFileSelect(e);

  function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  // Setup the dnd listeners.

  var dropZone = document.getElementById('message');
  dropZone.addEventListener('dragover', handleDragOver);
  dropZone.addEventListener('drop', handleFileSelect);


  function handleFileSelect(e) {

    var files = e.target.files; // FileList object
    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {
      //log(files);
      // Only process image files.
      //if (!f.type.match('image.*')) continue;

      log(f.size);
      let slice = f.slice(0, f.size);
      var reader = new FileReader();
      var binaryReader = new FileReader();   // for read binary data
      binaryReader.readAsBinaryString(f);



      binaryReader.onload = (e, f, socket) => {
        // log('BinaryUF_EVENT', e);
        // log('BinaryUF_SOCKET', window.socket);

        //let arr = new Int16Array;
        //arr = [e.target.result];
        //log(arr);
        //let output = JSON.stringify(arr);
        //log('array16', arr);
        //log('target', e.target);
        //window.socket.emit('userMessage', );
       // window.socket.emit('uploadFile', output);

      };

      reader.readAsDataURL(f);
      reader.onload = (function (f) {
        return function (e) {
          let allMessages = document.querySelector('.allMessages');
          allMessages.innerHTML += `<img src=" ${e.target.result}" title=" ${escape(f.name)}"/>`
          log('target', e.target.result);
          window.socket.emit('uploadFile', e.target.result);
          //log('file', f);
          //log(escape(f.name));
        }
      })(f, e);


    }
  }
}
export { filesExecute }
//export { handleFileSelect }

