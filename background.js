let offscreenReady = false;

async function setupOffscreenDocument() {
    if (await chrome.offscreen.hasDocument()) {
        offscreenReady = true;
        return;
    }

    await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['AUDIO_PLAYBACK'],
        justification: 'Play radio stream'
    });

    await new Promise(resolve => {
        const checkReady = () => {
            if (offscreenReady) resolve();
            else setTimeout(checkReady, 100);
        };
        checkReady();
    });
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    try {
        if (request.action === "setState") {
            await chrome.storage.session.set({ radioPlaying: request.state });

            if (request.state) {
                await setupOffscreenDocument();
                await sendMessageWithRetry({ action: "play" });
            } else {
                await sendMessageWithRetry({ action: "stop" });
                chrome.runtime.sendMessage({ action: "playbackStopped" }).catch(() => { });
            }
        } else if (request.action === "offscreenReady") {
            offscreenReady = true;
        }
    } catch (error) {
        console.error("Error handling message:", error);
    }
    return true;
});

async function sendMessageWithRetry(message, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            await chrome.runtime.sendMessage(message);
            return;
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 200 * (i + 1)));
        }
    }
}

chrome.runtime.onInstalled.addListener(async () => {
    await chrome.storage.session.set({ radioPlaying: false });
});

chrome.runtime.onSuspend.addListener(async () => {
    await chrome.storage.session.set({ radioPlaying: false });
    await sendMessageWithRetry({ action: "stop" });
});