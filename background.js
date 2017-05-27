;
"use strict";

var duk = (function() {
    var streams = { "40"  : "http://radio.4duk.ru/4duk40.mp3"
                  , "64"  : "http://radio.4duk.ru/4duk64.mp3"
                  , "128" : "http://radio.4duk.ru/4duk128.mp3"
                  };

    var audio = new Audio(); var playing = false;

    function isPlaying() { return playing; }
    function setPlaying(p) { playing = p; return playing; }

    function getStreamQuality()        { return localStorage[ "stream_quality" ] || "128"; }
    function setStreamQuality(stream_quality) { localStorage[ "stream_quality" ] = stream_quality; }

    function startPlaying() {
        audio.src = streams[ getStreamQuality() ];
        audio.load();
        audio.play();
        setPlaying(true);

        console.log(arguments.callee.name, audio.src);
    }

    function stopPlaying() {
        audio.pause();
        audio.currentTime = 0;
        audio.src = "";
        setPlaying(false);

        console.log(arguments.callee.name);
    }

    function shiftQuality() {
        var stream_quality = { "40"  : "64"
                             , "64"  : "128"
                             , "128" : "40"
                             }[ getStreamQuality() ];
        var was_playing = isPlaying();
        stopPlaying();
        setStreamQuality(stream_quality);
        if (was_playing) { startPlaying(); }

        console.log(arguments.callee.name);
    }

    chrome.commands.onCommand.addListener(function(command) {
        console.log("chrome commands' listener: ", command);

        switch (command) {
            case "toogle-playing": {
                if (isPlaying()) {
                    stopPlaying();
                } else {
                    startPlaying();
                }
            }
        }
    });

    return { startPlaying     : startPlaying
           , stopPlaying      : stopPlaying
           , shiftQuality     : shiftQuality
           , isPlaying        : isPlaying
           , getStreamQuality : getStreamQuality
    };
}());

function getDuk() { return duk; };

