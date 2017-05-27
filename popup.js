;
"use strict";

(function() {
    var duk = chrome.extension.getBackgroundPage().getDuk();
    window.addEventListener("load", setUpListeners);

    function setUpListeners() {
        console.log(arguments.callee.name);

        setQualityBtnText();
    	
        document.getElementById("start_btn")
                .addEventListener("click", function() {
                    duk.startPlaying();
                });
        
        document.getElementById("stop_btn")
                .addEventListener("click", function() {
                    duk.stopPlaying();
                });
    
        document.getElementById("4duk_link")
                .addEventListener("click", function() {
                    chrome.tabs.create({url: "http://4duk.ru"});
                });
    
        document.getElementById("close_btn")
                .addEventListener("click", function() {
                    window.close();
                });
    
        document.getElementById("quality_btn")
                .addEventListener("click", function() {
                    duk.shiftQuality();
                    setQualityBtnText();
                });
    }

    function setQualityBtnText() {
        var stream_name = { 40  : "Экономно"
                          , 64  : "Лёгкие помехи"
                          , 128 : "Качественно"
                          }[ duk.getStreamQuality() ];
        document.getElementById("quality_btn").textContent = stream_name;
    }
}()); 

