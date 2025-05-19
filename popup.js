"use strict";

(async function () {
    window.addEventListener("load", setUpListeners);

    async function sendMessage(action) {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage({ action }, (response) => {
                resolve(response);
            });
        });
    }

    async function setUpListeners() {
        console.log('setUpListeners');

        await setQualityBtnText();
        await setToggleBtnText();

        document.getElementById("toggle_btn")
            .addEventListener("click", async function () {
                const response = await sendMessage('isPlaying');
                if (response.playing) {
                    await sendMessage('stopPlaying');
                    setToggleBtnText("Вкл");
                } else {
                    await sendMessage('startPlaying');
                    setToggleBtnText("Выкл");
                }
            });

        document.getElementById("4duk_link")
            .addEventListener("click", function () {
                chrome.tabs.create({ url: "http://4duk.ru" });
            });

        document.getElementById("quality_btn")
            .addEventListener("click", async function () {
                await sendMessage('shiftQuality');
                await setQualityBtnText();
            });
    }

    async function setQualityBtnText() {
        const response = await sendMessage('getStreamQuality');
        const quality = response.quality;
        var stream = null;
        var btn = document.getElementById("quality_btn");

        switch (quality) {
            case "40": {
                stream = {
                    name: "Экономно"
                    , rem: "duk-hig-quality"
                    , add: "duk-low-quality"
                };
            } break;
            case "64": {
                stream = {
                    name: "С лёгкими помехами"
                    , rem: "duk-low-quality"
                    , add: "duk-mid-quality"
                };
            } break;
            case "128": {
                stream = {
                    name: "Зело квалитетно"
                    , rem: "duk-mid-quality"
                    , add: "duk-hig-quality"
                };
            } break;
        }

        btn.classList.remove(stream.rem);
        btn.classList.add(stream.add);
        btn.textContent = stream.name;
    }

    async function setToggleBtnText() {
        const response = await sendMessage('isPlaying');
        var text = null;
        var btn = document.getElementById("toggle_btn");

        if (response.playing) {
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
