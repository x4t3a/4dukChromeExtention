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
        console.log(response.streamName);
        var btn = document.getElementById("quality_btn");
        btn.textContent = response.streamName;
    });
};


window.addEventListener("load", main);

