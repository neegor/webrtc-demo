
'use strict';

// Put variables in global scope to make them available to the browser console.
const constraints = window.constraints = {
    audio: false,
    video: true
};

function handleSuccess(stream) {
    const video = document.querySelector('video');
    const videoTracks = stream.getVideoTracks();
    console.log('Got stream with constraints:', constraints);
    console.log(`Using video device: ${videoTracks[0].label}`);
    window.stream = stream; // make variable available to browser console
    video.srcObject = stream;
}

function handleError(error) {
    if (error.name === 'ConstraintNotSatisfiedError') {
        const v = constraints.video;
        errorMsg(`Разрешение ${v.width.exact}x${v.height.exact} px не поддерживается вашим устройством.`);
    } else if (error.name === 'PermissionDeniedError') {
        errorMsg('Вы запретили доступ к вашей камере и микрофону ' +
            'и для продолжения работы вам необходимо разрешить доступ к ним.');
    }
    errorMsg(`getUserMedia error: ${error.name}`, error);
}

function errorMsg(msg, error) {
    const errorElement = document.querySelector('#errorMsg');
    errorElement.innerHTML += `<p>${msg}</p>`;
    if (typeof error !== 'undefined') {
        console.error(error);
    }
}

async function init(e) {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
        e.target.disabled = true;
    } catch (e) {
        handleError(e);
    }
}

document.querySelector('#showVideo').addEventListener('click', e => init(e));