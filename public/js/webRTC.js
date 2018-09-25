const log = console.log;

var binaryVideoData = [];
let videoRemote = document.querySelector('#videoRemote');
let canvasRemote = document.querySelector('#canvasRemote');
let imageRemoteBase64 = document.querySelector('#imageRemoteBase64');
var videoLocal = document.querySelector('#videoLocal');
videoLocal.style.display = 'none';
var soundLocal = document.querySelector('#soundLocal');
var soundRemote = document.querySelector('#soundRemote');
var soundTEST = document.querySelector('#soundTEST');

let counter = 0;


var getAudioStream = function () {
  socket.on('audioStream', audioData => {
    log('AUDIO DATA', audioData);
    var blob = new Blob([audioData], { 'type': 'audio/ogg; codecs=opus' });
    soundRemote.src = window.URL.createObjectURL(blob);
    soundRemote.currentTime = counter;
    soundRemote.play();
    counter++;
  });
};


var stopSound = function () {
  window.recorder.stop();
};

var SoundConnection = function () {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  if (navigator.getUserMedia) {
    navigator.getUserMedia({ audio: true, video: false }, (stream) => {
      ////////////////////////////// For AUDIO element //////////////////////////////////
      soundLocal.srcObject = stream;
      log('AUDIO ', stream)



      let blobArray = [];
      const recorder = window.recorder = new MediaRecorder(stream);
      recorder.ondataavailable = event => {
        blobArray.push(event.data);
        var blob = new Blob(blobArray, { 'type': 'audio/ogg; codecs=opus' });
        log('AUDIOblob ', blob.size);
        log('AUDIOblob ', blob);
        socket.emit('stream', blob);
        log('RS', recorder.state);
        soundTEST.src = window.URL.createObjectURL(blob);
        soundTEST.play();
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
export { stopSound };

