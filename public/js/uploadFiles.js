const log = console.log;

function filesExecute(e, socket) {

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



  function parseFile(file, callback) {
    var fileSize = file.size;
    var chunkSize = 64 * 1024; // bytes
    var offset = 0;
    var self = this; // we need a reference to the current object
    var chunkReaderBlock = null;

    
    var readEventHandler = function (evt) {
      if (evt.target.error == null) {
        offset += evt.target.result.length;
        callback(evt.target.result); // callback for handling read chunk
      } else {
        console.log("Read error: " + evt.target.error);
        return;
      }
      if (offset >= fileSize) {
        console.log("Done reading file");
        return;
      }

      // of to the next chunk
      chunkReaderBlock(offset, chunkSize, file);
    }

    chunkReaderBlock = function (_offset, length, _file) {
      var r = new FileReader();
      var blob = _file.slice(_offset, length + _offset);
      r.onload = readEventHandler;
      r.readAsText(blob);
    }

    // now let's start the read with the first block
    chunkReaderBlock(offset, chunkSize, file);
  }

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
      binaryReader.readAsBinaryString(slice);


      parseFile(f, (chunk) => {
        log(chunk.length);
      });


      binaryReader.onload = (e, f, socket) => {

        //log('target', e.target.result);
        window.socket.emit('uploadFile', e.target.result);
      };

      reader.readAsDataURL(f);
      reader.onload = (function (f) {
        return function (e) {
          let allMessages = document.querySelector('.allMessages');
          allMessages.innerHTML += `<img src=" ${e.target.result}" title=" ${escape(f.name)}"/>`
        }
      })(f, e);


    }
  }
}
export { filesExecute }
//export { handleFileSelect }

