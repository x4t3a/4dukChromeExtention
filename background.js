/**
 * When chrome popup goes out of scope, all its scripts also do so.
 * Audio stops playing T.T
 * To prevent this we need something running in the background.
 * Chrome provides such functionality;
 * look for "background" field in the manifest.json
 * in which the background script is specified.
 * This script provides interface (free functions) which can be accessed via
 *      chrome.extension.getBackgroundPage()
 */


var streams = {
    "hohe"   : "http://radio.4duk.ru/4duk128.mp3",
    "mittlere" : "http://radio.4duk.ru/4duk64.mp3",
    "geringe"    : "http://radio.4duk.ru/4duk40.mp3",
};


var audio = new Audio();
var playing = false;

function isPlaying() { return playing; }

function start() {
	audio.src = streams[ getStreamName() ];
    audio.loop = true; /* Duct-tape. */
    audio.play();
    playing = true;
};


function stop() {
    audio.load();
    audio.pause();
    playing = false;
};


function shiftQuality() {
    var name = getStreamName();
    switch (name) {
        case "hohe": {
            name = "geringe";
        } break;
        default: case "mittlere": {
            name = "hohe";
        } break;
        case "geringe": {
            name = "mittlere";
        } break;
    }
    setStreamName(name);
    audio.pause();
    audio.src = streams[ name ];
    if (playing) {
        audio.play();
    }
};


function getStreamName() {
    return localStorage[ "stream" ] || "mittlere";
}


function setStreamName(name) {
    localStorage[ "stream" ] = name;
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var response = {};
    switch (request.method) {
        case "getStream": {
            response = {streamName: getStreamName()};
        } break;
        default: {
        } break;
    }
    sendResponse(response);
});

chrome.commands.onCommand.addListener(function(command) {
    console.log('onCommand event received for message: ', command);
    switch (command) {
        case "toogle-playing": {
            if (playing) {
                stop();
            } else {
                start();
            }
        }
    }
});

/* For later debugging.
audio.addEventListener("canplay", function() {
    alert("canplay");
});

audio.addEventListener("stalled", function() {
    alert("stalled");
});

audio.addEventListener("abort", function() {
    alert("abort");
});
*/
