let audio = null;

chrome.runtime.sendMessage({ action: "offscreenReady" }).catch(() => { });

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    try {
        if (request.action === "play") {
            if (!audio) {
                audio = new Audio('http://radio.4duk.ru/4duk128.mp3');
                audio.loop = true;

                audio.addEventListener('playing', () => {
                    chrome.runtime.sendMessage({ action: "playbackStarted" });
                });

                audio.addEventListener('error', () => {
                    chrome.runtime.sendMessage({ action: "playbackFailed" });
                });

                try {
                    await audio.play();
                } catch (error) {
                    console.error("Playback failed:", error);
                    await chrome.storage.local.set({ radioPlaying: false });
                    chrome.runtime.sendMessage({ action: "playbackFailed" });
                }
            }
        } else if (request.action === "stop") {
            if (audio) {
                audio.pause();
                audio = null;
                chrome.runtime.sendMessage({ action: "playbackStopped" });
            }
        }
    } catch (error) {
        console.error("Error handling message:", error);
    }
});

(async () => {
    const result = await chrome.storage.local.get(['radioPlaying']);
    if (result.radioPlaying) {
        audio = new Audio('http://radio.4duk.ru/4duk128.mp3');
        audio.loop = true;
        try {
            await audio.play();
        } catch (error) {
            console.error("Initial playback failed:", error);
            await chrome.storage.local.set({ radioPlaying: false });
        }
    }
})();