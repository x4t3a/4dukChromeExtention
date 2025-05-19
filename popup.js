document.addEventListener('DOMContentLoaded', async function () {
    const radioBtn = document.getElementById('radioBtn');
    const statusText = document.getElementById('status');
    const icon = radioBtn.querySelector('.icon');
    const btnText = radioBtn.querySelector('div:not(.icon)');
    let isPlaying = false;

    // Load saved state
    const result = await chrome.storage.local.get(['radioPlaying']);
    if (result.radioPlaying) {
        setPlayingState(true);
    }

    // Button click handler
    radioBtn.addEventListener('click', async function () {
        const desiredState = !isPlaying;
        setLoadingState(desiredState);

        try {
            const response = await chrome.runtime.sendMessage({
                action: "setState",
                state: desiredState
            });

            setTimeout(() => {
                if (isPlaying === desiredState) {
                    setPlayingState(desiredState);
                }
            }, 1000);

        } catch (error) {
            console.error("Error toggling radio:", error);
            setPlayingState(false);
            statusText.textContent = "Ошибка - попробуйте снова";
        }
    });

    // Listen for playback updates
    chrome.runtime.onMessage.addListener((request) => {
        if (request.action === "playbackStarted") {
            setPlayingState(true);
        } else if (request.action === "playbackStopped") {
            setPlayingState(false);
        } else if (request.action === "playbackFailed") {
            setPlayingState(false);
            statusText.textContent = "Ошибка соединения";
        }
    });

    function setLoadingState(loading) {
        radioBtn.disabled = true;
        statusText.textContent = loading ? 'выходим в iфир...' : 'auf wiedersehen...';
        radioBtn.classList.toggle('connecting', loading);
        icon.textContent = loading ? '🔄' : '⏹️';
        btnText.textContent = loading ? '...' : 'готовъ';
    }

    function setPlayingState(playing) {
        isPlaying = playing;
        radioBtn.disabled = false;
        radioBtn.classList.remove('connecting');

        if (playing) {
            icon.textContent = '▶️';
            btnText.textContent = 'в iфире';
            statusText.textContent = 'идётъ трансляция';
        } else {
            icon.textContent = '⏹️';
            btnText.textContent = 'готовъ';
            statusText.textContent = 'к работе готовъ';
        }
    }
});