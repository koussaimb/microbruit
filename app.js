let audioContext;
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

startButton.addEventListener('click', async () => {
    startButton.disabled = true;

    // Chargez le modèle RNNoise
    const rnnoise = new RnNoise();

    // Créez un scriptProcessor pour traiter l'audio avec RNNoise
    const bufferSize = 4096;
    const numberOfInputChannels = 1;
    const numberOfOutputChannels = 1;

    const scriptProcessor = audioContext.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels);
    scriptProcessor.onaudioprocess = (event) => {
        const inputBuffer = event.inputBuffer.getChannelData(0);
        const outputBuffer = event.outputBuffer.getChannelData(0);
        rnnoise.process(inputBuffer, outputBuffer);
    };

    // Le reste du code du gestionnaire d'événements ...

    const remoteStream = remoteAudio.srcObject;
    const remoteSource = audioContext.createMediaStreamSource(remoteStream);
    const remoteDestination = audioContext.createMediaStreamDestination();
    remoteSource.connect(scriptProcessor);
    scriptProcessor.connect(remoteDestination);

    const filteredStream = new MediaStream([remoteDestination.stream.getAudioTracks()[0]]);
    remoteAudio.srcObject = filteredStream;

    // Configurez MediaRecorder pour enregistrer le flux filtré
    mediaRecorder = new MediaRecorder(filteredStream);
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = handleStop;
});



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
  
    console.log('Enregistrement terminé et audio prêt à être lu.');
  }

// recordButton.addEventListener('click', () => {
//     mediaRecorder = new MediaRecorder(remoteAudio.srcObject);
//     mediaRecorder.start();
//     console.log('Enregistrement en cours...');

//     recordButton.disabled = true;
//     stopRecordButton.disabled = false;

//     mediaRecorder.ondataavailable = (e) => {
//         chunks.push(e.data);
//     };


//     mediaRecorder.onstop = () => {
//         const blob = new Blob(chunks, { type: 'audio/webm; codecs=opus' });
//         chunks = [];
//         const audioURL = URL.createObjectURL(blob);
//         recordedAudio.src = audioURL;

//         // Mise à jour du lien de téléchargement
//         downloadLink.href = audioURL;
//         downloadLink.download = 'enregistrement_audio.webm';
//         downloadButton.disabled = false;

//         console.log('Enregistrement terminé et audio prêt à être lu.');
//     };

// });

// stopRecordButton.addEventListener('click', () => {
//     if (mediaRecorder && mediaRecorder.state !== 'inactive') {
//         mediaRecorder.stop();
//         recordButton.disabled = false;
//         stopRecordButton.disabled = true;
//     }
// });

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