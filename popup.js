;
"use strict";

(function() {
    var duk = chrome.extension.getBackgroundPage().getDuk();
    window.addEventListener("load", setUpListeners);

    function setUpListeners() {
        console.log(arguments.callee.name);

        setQualityBtnText();
        setToggleBtnText();
    	
        document.getElementById("toggle_btn")
                .addEventListener("click", function() {
                    if (duk.isPlaying()) {
                        duk.stopPlaying();
                        setToggleBtnText("Вкл");
                    } else {
                        duk.startPlaying();
                        setToggleBtnText("Выкл");
                    }
                });
    
        document.getElementById("4duk_link")
                .addEventListener("click", function() {
                    chrome.tabs.create({url: "http://4duk.ru"});
                });
    
        document.getElementById("quality_btn")
                .addEventListener("click", function() {
                    duk.shiftQuality();
                    setQualityBtnText();
                });
    }

    function setQualityBtnText() {
        var stream = null;
        var btn = document.getElementById("quality_btn");

        switch (duk.getStreamQuality()) {
            case "40":  {
                stream = { name : "Экономно"
                         , rem  : "duk-hig-quality"
                         , add  : "duk-low-quality"
                         };
            } break;
            case "64":  {
                stream = { name : "С лёгкими помехами"
                         , rem  : "duk-low-quality"
                         , add  : "duk-mid-quality"
                         };
            } break;
            case "128": {
                stream = { name : "Зело квалитетно"
                         , rem  : "duk-mid-quality"
                         , add  : "duk-hig-quality"
                         };
            } break;
        }

        btn.classList.remove(stream.rem);
        btn.classList.add(stream.add);
        btn.textContent = stream.name;
    }

    function setToggleBtnText() {
        var text = null;
        var btn = document.getElementById("toggle_btn");

        if (duk.isPlaying()) {
            btn.textContent = "Выкл";
            btn.classList.remove("duk-red");
            btn.classList.add("duk-green");
        } else {
            btn.textContent = "Вкл";
            btn.classList.remove("duk-green");
            btn.classList.add("duk-red");
        }
    }
}()); 

