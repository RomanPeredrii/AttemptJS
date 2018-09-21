const log = console.log;

var binaryVideoData = [];
let videoRemote = document.querySelector('#videoRemote');
let canvasRemote = document.querySelector('#canvasRemote');
let imageRemoteBase64 = document.querySelector('#imageRemoteBase64');
var videoLocal = document.querySelector('#videoLocal');
videoLocal.style.display = 'none';
var soundLocal = document.querySelector('#soundLocal');
var soundRemote = document.querySelector('#soundRemote');


var getVideoStream = function () {
  socket.on('streamImg', (imageBase64) => {
    imageRemoteBase64.src = imageBase64;
  });
};

var getAudioStream = function () {
  socket.on('audioStream', (audioData) => {

    log('AUDIO DATA', audioData);
    //soundRemote.srcObject = audioData[0];
  } );
};





var SoundConnection = function () {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  if (navigator.getUserMedia) {
    navigator.getUserMedia({ audio: true, video: false }, (stream) => {
      ////////////////////////////// For AUDIO element //////////////////////////////////
     
      soundLocal.srcObject = stream;

      let JSONStream = JSON.stringify(stream.getAudioTracks());
      socket.emit('stream', JSONStream);
      log('AUDIO ', stream)



      // videoLocal.onloadedmetadata = (e) => videoLocal.play();
      // log('stream.getVideoTracks() --> ', stream.getVideoTracks())



      //soundRemote.srcObject = stream;




      //////////////////////////////// get BLOB data ////////////////////////////////////

      // use MediaStream Recording API
      //const recorder = new MediaRecorder(stream);
      // fires every one second and passes an BlobEvent
      //recorder.ondataavailable = event => {
      // get the Blob from the event
      //const blob = event.data;
      // and send that blob to the server...
      //socket.emit('blob', blob)
      // };
      // make data available event fire every one second
      //recorder.start(1000);
    },

      (err) => { log("The following error occurred: " + err.name) }

    )
  } else log("getUserMedia not supported");
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

      //////////////////////////////// get BLOB data ////////////////////////////////////

      // use MediaStream Recording API
      //const recorder = new MediaRecorder(stream);
      // fires every one second and passes an BlobEvent
      //recorder.ondataavailable = event => {
      // get the Blob from the event
      //const blob = event.data;
      // and send that blob to the server...
      //socket.emit('blob', blob)
      // };
      // make data available event fire every one second
      //recorder.start(1000);
    },

      (err) => { log("The following error occurred: " + err.name) }

    )
  } else log("getUserMedia not supported");
};

export { SoundConnection };
export { VideoConnection };
export { getVideoStream };
export { getAudioStream };












/*let localConnection;
let remoteConnection;
let sendChannel;
let receiveChannel;
const dataChannelSend = document.querySelector('textarea#dataChannelSend');
const dataChannelReceive = document.querySelector('textarea#dataChannelReceive');
const startButton = document.querySelector('button#startButton');
const sendButton = document.querySelector('button#sendButton');
const closeButton = document.querySelector('button#closeButton');

startButton.onclick = createConnection;
sendButton.onclick = sendData;
closeButton.onclick = closeDataChannels;

function enableStartButton() {
  startButton.disabled = false;
}

function disableSendButton() {
  sendButton.disabled = true;
}

function createConnection() {
  dataChannelSend.placeholder = '';
  const servers = null;
  window.localConnection = localConnection = new RTCPeerConnection(servers);
  console.log('Created local peer connection object localConnection');

  sendChannel = localConnection.createDataChannel('sendDataChannel');
  console.log('Created send data channel');

  localConnection.onicecandidate = e => {
    onIceCandidate(localConnection, e);
  };
  sendChannel.onopen = onSendChannelStateChange;
  sendChannel.onclose = onSendChannelStateChange;

  window.remoteConnection = remoteConnection = new RTCPeerConnection(servers);
  console.log('Created remote peer connection object remoteConnection');

  remoteConnection.onicecandidate = e => onIceCandidate(remoteConnection, e);  // 

  remoteConnection.ondatachannel = receiveChannelCallback;

  localConnection.createOffer().then(
    gotDescription1,
    onCreateSessionDescriptionError
  );
  startButton.disabled = true;
  closeButton.disabled = false;
}

function onCreateSessionDescriptionError(error) {
  console.log('Failed to create session description: ' + error.toString());
}

function sendData() {
  const data = dataChannelSend.value;
  sendChannel.send(data);
  console.log('Sent Data: ' + data);
}

function closeDataChannels() {
  console.log('Closing data channels');
  sendChannel.close();
  console.log('Closed data channel with label: ' + sendChannel.label);
  receiveChannel.close();
  console.log('Closed data channel with label: ' + receiveChannel.label);
  localConnection.close();
  remoteConnection.close();
  localConnection = null;
  remoteConnection = null;
  console.log('Closed peer connections');
  startButton.disabled = false;
  sendButton.disabled = true;
  closeButton.disabled = true;
  dataChannelSend.value = '';
  dataChannelReceive.value = '';
  dataChannelSend.disabled = true;
  disableSendButton();
  enableStartButton();
}

function gotDescription1(desc) {
  localConnection.setLocalDescription(desc);
  console.log(`Offer from localConnection\n${desc.sdp}`);
  remoteConnection.setRemoteDescription(desc);
  remoteConnection.createAnswer().then(
    gotDescription2,
    onCreateSessionDescriptionError
  );
}

function gotDescription2(desc) {
  remoteConnection.setLocalDescription(desc);
  console.log(`Answer from remoteConnection\n${desc.sdp}`);
  localConnection.setRemoteDescription(desc);
}

function getOtherPc(pc) {
  return (pc === localConnection) ? remoteConnection : localConnection;
}

function getName(pc) {
  return (pc === localConnection) ? 'localPeerConnection' : 'remotePeerConnection';
}

function onIceCandidate(pc, event) {
  getOtherPc(pc)
    .addIceCandidate(event.candidate)
    .then(
      () => onAddIceCandidateSuccess(pc),
      err => onAddIceCandidateError(pc, err)
    );
  console.log(`${getName(pc)} ICE candidate: ${event.candidate ? event.candidate.candidate : '(null)'}`);
  console.log('EVENT', event);
}

function onAddIceCandidateSuccess() {
  console.log('AddIceCandidate success.');
}

function onAddIceCandidateError(error) {
  console.log(`Failed to add Ice Candidate: ${error.toString()}`);
}

function receiveChannelCallback(event) {
  console.log('Receive Channel Callback');
  receiveChannel = event.channel;
  receiveChannel.onmessage = onReceiveMessageCallback;
  receiveChannel.onopen = onReceiveChannelStateChange;
  receiveChannel.onclose = onReceiveChannelStateChange;
}

function onReceiveMessageCallback(event) {
  console.log('Received Message');
  dataChannelReceive.value = event.data;
}

function onSendChannelStateChange() {
  const readyState = sendChannel.readyState;
  console.log('Send channel state is: ' + readyState);
  if (readyState === 'open') {
    dataChannelSend.disabled = false;
    dataChannelSend.focus();
    sendButton.disabled = false;
    closeButton.disabled = false;
  } else {
    dataChannelSend.disabled = true;
    sendButton.disabled = true;
    closeButton.disabled = true;
  }
}

function onReceiveChannelStateChange() {
  const readyState = receiveChannel.readyState;
  console.log(`Receive channel state is: ${readyState}`);
}
*/