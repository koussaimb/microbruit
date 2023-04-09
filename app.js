const createRNNWasmModule = require('./rnnoise.js').default;

let audioContext = new AudioContext();
let lowpassFilter;

const startButton = document.getElementById('start');
const recordButton = document.getElementById('record');
const stopRecordButton = document.getElementById('stopRecord');
const remoteAudio = document.getElementById('remoteAudio');
const recordedAudio = document.getElementById('recordedAudio');

const downloadButton = document.getElementById('download');
const downloadLink = document.getElementById('downloadLink');

let localConnection;
let remoteConnection;
let localStream;
let mediaRecorder;
let chunks = [];

async function handleStartButtonClick() {
  startButton.disabled = true;

  await audioContext.audioWorklet.addModule('processor.js');
  const rnnoiseProcessor = new AudioWorkletNode(audioContext, 'rnnoise-processor');

  const remoteStream = remoteAudio.srcObject;
  const remoteSource = audioContext.createMediaStreamSource(remoteStream);
  const remoteDestination = audioContext.createMediaStreamDestination();
  remoteSource.connect(rnnoiseProcessor);
  rnnoiseProcessor.connect(remoteDestination);

  const filteredStream = new MediaStream([remoteDestination.stream.getAudioTracks()[0]]);
  remoteAudio.srcObject = filteredStream;

  // Configurez MediaRecorder pour enregistrer le flux filtré
  mediaRecorder = new MediaRecorder(filteredStream);
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.onstop = handleStop;
  recordButton.disabled = false;
}


startButton.addEventListener('click', handleStartButtonClick);

async function initMicrophone() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    remoteAudio.srcObject = stream;
    console.log('Microphone activé:', stream);
  } catch (err) {
    console.error('Erreur lors de l\'activation du microphone:', err);
  }
}

initMicrophone();

function handleDataAvailable(event) {
  if (event.data.size > 0) {
      chunks.push(event.data);
  }
}

function handleStop() {
  const blob = new Blob(chunks, { type: 'audio/webm; codecs=opus' });
  chunks = [];
  const audioURL = URL.createObjectURL(blob);
  recordedAudio.src = audioURL;

  // Mise à jour du lien de téléchargement
  downloadLink.href = audioURL;
  downloadLink.download = 'enregistrement_audio.webm';
  downloadButton.disabled = false;

  // Vérifier si l'enregistrement est terminé avant de permettre la lecture
  recordedAudio.onloadedmetadata = () => {
    recordButton.disabled = true;
    stopRecordButton.disabled = true;
    recordedAudio.play();
    console.log('Enregistrement terminé et audio prêt à être lu.');
  }
}


recordButton.addEventListener('click', () => {
  if (mediaRecorder) {
    mediaRecorder.start();
    console.log('Enregistrement en cours...');

    recordButton.disabled = true;
    stopRecordButton.disabled = false;
  } else {
    console.error('MediaRecorder n\'est pas défini.');
  }
});

stopRecordButton.addEventListener('click', () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    recordButton.disabled = false;
    stopRecordButton.disabled = true;
  }
});
  
downloadButton.addEventListener('click', () => {
    downloadLink.click();
});