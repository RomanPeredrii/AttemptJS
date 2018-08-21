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

  log('UF_SOCKET', socket);
  log('UF_EVENT', e);
  handleFileSelect(e);



  //socket.emit('userMessage', 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
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
      log(files);
      // Only process image files.
      if (!f.type.match('image.*')) continue;
      let slice = f.slice(0, 1000);
      var reader = new FileReader();
      var binaryReader = new FileReader();   // for read binary data
      binaryReader.readAsBinaryString(slice);


      /*
            binaryReader.onload = (function (e, f, socket) {
              return function (e, f, socket) {
      
                // log('file', e);
                socket.emit('userMessage', 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'); 
                log('OUTPUT', e.target.result);
      
                
      
                
              }
      
            })(e, f, socket);
      */


      binaryReader.onload = (e, f, socket) => {
        log('BinaryUF_EVENT', e);
        log('BinaryUF_SOCKET', window.socket);
        
        let arr = new Int8Array;
        arr = [e.target.result];
        log(arr);
        let output = JSON.stringify(arr, null, '  ');
        log(output);
        window.socket.emit('userMessage', output);

      };

      reader.readAsDataURL(f);
      reader.onload = (function (f) {
        return function (e) {
          let allMessages = document.querySelector('.allMessages');
          allMessages.innerHTML += `<img src=" ${e.target.result}" title=" ${escape(f.name)}"/>`
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
}
export { filesExecute }
//export { handleFileSelect }

