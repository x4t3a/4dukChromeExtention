/* None of C++ developers can live w/o the main function. */
function main() {
    var bgp = chrome.extension.getBackgroundPage(); /* Access the background. */
    setQualityBtnText();
	
    document.getElementById("start_btn")
            .addEventListener("click", function() {
                bgp.start();
            });
    
    document.getElementById("stop_btn")
            .addEventListener("click", function() {
                bgp.stop();
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
                bgp.shiftQuality();
                setQualityBtnText();
            });
};


function setQualityBtnText() {
    chrome.runtime.sendMessage({method: "getStream"}, function(response) {
		var name = "";
        switch (response.streamName) {
            case "hohe": {
                name = "Качественно";
            } break;
            default: case "mittlere": {
                name = "Лёгкие помехи";
            } break;
            case "geringe": {
                name = "Экономно";
            } break;
        }
        var btn = document.getElementById("quality_btn");
        btn.textContent = name;
    });
};


window.addEventListener("load", main);

