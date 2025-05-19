"use strict";

const streams = {
    "40": "http://radio.4duk.ru/4duk40.mp3",
    "64": "http://radio.4duk.ru/4duk64.mp3",
    "128": "http://radio.4duk.ru/4duk128.mp3"
};

let audio = null;
let playing = false;

function isPlaying() { return playing; }
function setPlaying(p) { playing = p; return playing; }

async function getStreamQuality() {
    const result = await chrome.storage.local.get("stream_quality");
    return result.stream_quality || "128";
}

async function setStreamQuality(stream_quality) {
    await chrome.storage.local.set({ stream_quality });
}

async function startPlaying() {
    if (!audio) {
        audio = new Audio();

        audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            setPlaying(false);
        });
    }

    const quality = await getStreamQuality();
    audio.src = streams[quality];
    await audio.play();
    setPlaying(true);
    console.log('startPlaying', audio.src);
}

function stopPlaying() {
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.src = "";
        setPlaying(false);
    }
    console.log('stopPlaying');
}

async function shiftQuality() {
    const currentQuality = await getStreamQuality();
    const stream_quality = {
        "40": "64",
        "64": "128",
        "128": "40"
    }[currentQuality];

    const was_playing = isPlaying();
    stopPlaying();
    await setStreamQuality(stream_quality);
    if (was_playing) {
        await startPlaying();
    }
    console.log('shiftQuality');
}

chrome.commands.onCommand.addListener(async (command) => {
    console.log("chrome commands' listener: ", command);

    switch (command) {
        case "toogle-playing": {
            if (isPlaying()) {
                stopPlaying();
            } else {
                await startPlaying();
            }
            break;
        }
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case 'startPlaying':
            startPlaying().then(() => sendResponse({ success: true }));
            return true;
        case 'stopPlaying':
            stopPlaying();
            sendResponse({ success: true });
            break;
        case 'shiftQuality':
            shiftQuality().then(() => sendResponse({ success: true }));
            return true;
        case 'isPlaying':
            sendResponse({ playing: isPlaying() });
            break;
        case 'getStreamQuality':
            getStreamQuality().then(quality => sendResponse({ quality }));
            return true;
    }
});