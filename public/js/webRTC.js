const log = console.log;

var binaryVideoData = [];
let videoRemote = document.querySelector('#videoRemote');
let canvasRemote = document.querySelector('#canvasRemote');
let imageRemoteBase64 = document.querySelector('#imageRemoteBase64');
var videoLocal = document.querySelector('#videoLocal');
videoLocal.style.display = 'none';
var soundLocal = document.querySelector('#soundLocal');
var soundRemote = document.querySelector('#soundRemote');




var getAudioStream = function () {
  socket.on('audioStream', (audioData) => {
    log('AUDIO DATA', audioData);
    var blob = new Blob([audioData], { 'type': 'audio/ogg; codecs=opus' });
    soundRemote.src = window.URL.createObjectURL(blob);
    log('AUDIO DATA', soundRemote.src);
    soundRemote.play();
  });
};


var SoundConnection = function () {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  if (navigator.getUserMedia) {
    navigator.getUserMedia({ audio: true, video: false }, (stream) => {
      ////////////////////////////// For AUDIO element //////////////////////////////////
      soundLocal.srcObject = stream;
      log('AUDIO ', stream)
      let blobArray = [];
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = event => {
        blobArray.push(event.data);
        log('AUDIOblob ', blobArray.length);
        var blob = new Blob(blobArray, { 'type': 'audio/ogg; codecs=opus' });
        log('AUDIOblob ', blobArray);
        log('AUDIOblob ', blob);
        socket.emit('stream', blob);
        blobArray = [];
        log('AUDIOblob ', blobArray);
      };
      recorder.start(1000);

    }, (err) => { log("The following error occurred: " + err.name) })
  } else log("getUserMedia not supported");
};

var getVideoStream = function () {
  socket.on('streamImg', (imageBase64) => {
    imageRemoteBase64.src = imageBase64;
  });
};

var VideoConnection = function () {
  videoLocal.style.display = 'block';
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  if (navigator.getUserMedia) {
    navigator.getUserMedia({ audio: false, video: { width: 320, height: 180 } }, (stream) => {
      ////////////////////////////// For VIDEO element //////////////////////////////////
      videoLocal.srcObject = stream;
      videoLocal.onloadedmetadata = (e) => videoLocal.play();
      log('stream.getVideoTracks() --> ', stream.getVideoTracks())
      ////////////////////////////// For CANVAS //////////////////////////////////
      let canvasLocal = document.querySelector('#canvasLocal');
      let ctx = canvasLocal.getContext('2d');
      setInterval(() => snapshot(), 40);
      function snapshot() {
        let w = videoLocal.videoWidth;
        let h = videoLocal.videoHeight;
        canvasLocal.width = w;
        canvasLocal.height = h;
        ctx.drawImage(videoLocal, 0, 0, w, h);
        let imageBase64 = ctx.canvas.toDataURL("image/webp", 1);
        socket.emit('imgBase64', imageBase64);
      }
    },
      (err) => { log("The following error occurred: " + err.name) }
    )
  } else log("getUserMedia not supported");
};

export { SoundConnection };
export { VideoConnection };
export { getVideoStream };
export { getAudioStream };

