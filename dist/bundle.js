/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./app.js":
/*!****************!*\
  !*** ./app.js ***!
  \****************/
/***/ (() => {

eval("let audioContext;\nlet lowpassFilter;\n\n\n\nconst startButton = document.getElementById('start');\nconst recordButton = document.getElementById('record');\nconst stopRecordButton = document.getElementById('stopRecord');\nconst remoteAudio = document.getElementById('remoteAudio');\nconst recordedAudio = document.getElementById('recordedAudio');\n\nconst downloadButton = document.getElementById('download');\nconst downloadLink = document.getElementById('downloadLink');\n\n\nlet localConnection;\nlet remoteConnection;\nlet localStream;\nlet mediaRecorder;\nlet chunks = [];\n\nstartButton.addEventListener('click', async () => {\n    startButton.disabled = true;\n\n    // Chargez le modèle RNNoise\n    const rnnoise = new RnNoise();\n\n    // Créez un scriptProcessor pour traiter l'audio avec RNNoise\n    const bufferSize = 4096;\n    const numberOfInputChannels = 1;\n    const numberOfOutputChannels = 1;\n\n    const scriptProcessor = audioContext.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels);\n    scriptProcessor.onaudioprocess = (event) => {\n        const inputBuffer = event.inputBuffer.getChannelData(0);\n        const outputBuffer = event.outputBuffer.getChannelData(0);\n        rnnoise.process(inputBuffer, outputBuffer);\n    };\n\n    // Le reste du code du gestionnaire d'événements ...\n\n    const remoteStream = remoteAudio.srcObject;\n    const remoteSource = audioContext.createMediaStreamSource(remoteStream);\n    const remoteDestination = audioContext.createMediaStreamDestination();\n    remoteSource.connect(scriptProcessor);\n    scriptProcessor.connect(remoteDestination);\n\n    const filteredStream = new MediaStream([remoteDestination.stream.getAudioTracks()[0]]);\n    remoteAudio.srcObject = filteredStream;\n\n    // Configurez MediaRecorder pour enregistrer le flux filtré\n    mediaRecorder = new MediaRecorder(filteredStream);\n    mediaRecorder.ondataavailable = handleDataAvailable;\n    mediaRecorder.onstop = handleStop;\n});\n\n\n\nasync function initMicrophone() {\n    try {\n        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });\n        remoteAudio.srcObject = stream;\n        console.log('Microphone activé:', stream);\n    } catch (err) {\n        console.error('Erreur lors de l\\'activation du microphone:', err);\n    }\n}\ninitMicrophone();\nfunction handleDataAvailable(event) {\n    if (event.data.size > 0) {\n        chunks.push(event.data);\n    }\n}\n\nfunction handleStop() {\n    const blob = new Blob(chunks, { type: 'audio/webm; codecs=opus' });\n    chunks = [];\n    const audioURL = URL.createObjectURL(blob);\n    recordedAudio.src = audioURL;\n  \n    // Mise à jour du lien de téléchargement\n    downloadLink.href = audioURL;\n    downloadLink.download = 'enregistrement_audio.webm';\n    downloadButton.disabled = false;\n  \n    console.log('Enregistrement terminé et audio prêt à être lu.');\n  }\n\n// recordButton.addEventListener('click', () => {\n//     mediaRecorder = new MediaRecorder(remoteAudio.srcObject);\n//     mediaRecorder.start();\n//     console.log('Enregistrement en cours...');\n\n//     recordButton.disabled = true;\n//     stopRecordButton.disabled = false;\n\n//     mediaRecorder.ondataavailable = (e) => {\n//         chunks.push(e.data);\n//     };\n\n\n//     mediaRecorder.onstop = () => {\n//         const blob = new Blob(chunks, { type: 'audio/webm; codecs=opus' });\n//         chunks = [];\n//         const audioURL = URL.createObjectURL(blob);\n//         recordedAudio.src = audioURL;\n\n//         // Mise à jour du lien de téléchargement\n//         downloadLink.href = audioURL;\n//         downloadLink.download = 'enregistrement_audio.webm';\n//         downloadButton.disabled = false;\n\n//         console.log('Enregistrement terminé et audio prêt à être lu.');\n//     };\n\n// });\n\n// stopRecordButton.addEventListener('click', () => {\n//     if (mediaRecorder && mediaRecorder.state !== 'inactive') {\n//         mediaRecorder.stop();\n//         recordButton.disabled = false;\n//         stopRecordButton.disabled = true;\n//     }\n// });\n\nrecordButton.addEventListener('click', () => {\n    if (mediaRecorder) {\n      mediaRecorder.start();\n      console.log('Enregistrement en cours...');\n  \n      recordButton.disabled = true;\n      stopRecordButton.disabled = false;\n    } else {\n      console.error('MediaRecorder n\\'est pas défini.');\n    }\n  });\n  \n  stopRecordButton.addEventListener('click', () => {\n    if (mediaRecorder && mediaRecorder.state !== 'inactive') {\n      mediaRecorder.stop();\n      recordButton.disabled = false;\n      stopRecordButton.disabled = true;\n    }\n  });\n  \ndownloadButton.addEventListener('click', () => {\n    downloadLink.click();\n});\n\n//# sourceURL=webpack://micropphone/./app.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./app.js"]();
/******/ 	
/******/ })()
;