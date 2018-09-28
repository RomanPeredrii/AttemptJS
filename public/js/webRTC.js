const log = console.log;

//var binaryVideoData = [];
//let videoRemote = document.querySelector('#videoRemote');
//let canvasRemote = document.querySelector('#canvasRemote');
let imageRemoteBase64 = document.querySelector('#imageRemoteBase64');
var videoLocal = document.querySelector('#videoLocal');
videoLocal.style.display = 'none';
var soundLocal = document.querySelector('#soundLocal');
soundLocal.style.display = 'none';
var soundRemote = document.querySelector('#soundRemote');
soundRemote.style.display = 'none';

var getAudioStream = function () {
  //soundRemote.style.display = 'block';
  socket.on('audioStream', audioData => {
    log('AUDIO DATA', audioData);
    var blob = new Blob([audioData], { 'type': 'audio/mp3; codecs=opus' });
    soundRemote.src = window.URL.createObjectURL(blob);
    soundRemote.play();
  });
};

var SoundConnection = function () {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  if (navigator.getUserMedia) {
    navigator.getUserMedia({ audio: true, video: false }, (stream) => {
      ////////////////////////////// For AUDIO element //////////////////////////////////
      soundLocal.srcObject = stream;
      let blobArray;
      let recorder = window.recorder = new MediaRecorder(stream);

      log('AUDIOstream ', stream);
      recorder.start();
      recorder.onstart = () => {
        blobArray = [];
      };

      recorder.ondataavailable = event => {
        log('*******************************START**********************************');
        log('eventData', event.data);

        blobArray.push(event.data);
        log('blobArray', blobArray);
        log('blobArraylength ', blobArray.length);
      };

      recorder.onstop = () => {
        var blob = new Blob(blobArray, { 'type': 'audio/mp3; codecs=opus' });
        log('BLOBsize ', blob.size);
        log('AUDIOblob ', blob);
        socket.emit('stream', blob);
        log('RecorderState', recorder.state);
        log('******************************END*************************************');
      };
      
      setInterval(() => {
        recorder.stop();
        recorder.start();
      }, 2000);
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

