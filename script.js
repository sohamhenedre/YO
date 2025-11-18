let currentStep = 0; // Start at step 0 for the password gate
let messagesDiscovered = 0;
const totalMessages = 3;
const CORRECT_CODE = "THEAVENGERS"; // <-- !!! REPLACE "SECRETCODE" with your actual password !!!

// --- YouTube Player Variables ---
let player;
let isPlayerReady = false;
const songTitles = {
    'WnU0lH6C0EA': "Zehnaseeb (Playing Now!)",
    'uq00EreNHYk': "Aapki Ankhon Me... (Playing Now!)",
    'y_GVDbfaiwQ': "Dooron Dooron Me (Playing Now!)"
};

/**
 * NEW: Checks the password entered by the user.
 */
function checkAccessCode() {
    const enteredCode = document.getElementById('access-code').value.trim();
    const errorMessage = document.getElementById('error-message');

    if (enteredCode.toUpperCase() === CORRECT_CODE.toUpperCase()) {
        errorMessage.classList.add('hidden');
        nextStep(1); // Proceed to the first step of the website
    } else {
        errorMessage.classList.remove('hidden');
        // Clear input field for security
        document.getElementById('access-code').value = ''; 
    }
}

/**
 * 1. Called automatically by the YouTube IFrame API script when it loads.
 */
function onYouTubeIframeAPIReady() {
    isPlayerReady = true;
    console.log("YouTube API is ready.");
}

// ... (Rest of the YouTube functions remain the same) ...
function loadAndPlayVideo(videoId) {
    const playerStatusElement = document.getElementById('player-status');
    const playerContainer = document.getElementById('youtube-player-container');
    
    playerContainer.innerHTML = '';
    
    const playerDiv = document.createElement('div');
    playerDiv.id = 'yt-player-embed';
    playerContainer.appendChild(playerDiv);
    
    playerStatusElement.style.display = 'none';

    player = new YT.Player('yt-player-embed', {
        height: '60', 
        width: '100%',
        videoId: videoId,
        playerVars: {
            'autoplay': 1,
            'controls': 1,
            'disablekb': 1,
            'modestbranding': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    event.target.playVideo();
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        const videoId = player.getVideoData().video_id;
        document.getElementById('player-status').textContent = songTitles[videoId];
        document.getElementById('player-status').style.display = 'block';
    }
}


/**
 * Handles the transition to the next step (screen)
 * @param {number} stepNumber - The step to transition to
 */
function nextStep(stepNumber) {
    // Determine the step ID to hide (either current step or access gate)
    let stepToHideId;
    if (currentStep === 0) {
        stepToHideId = 'access-gate';
    } else {
        stepToHideId = `step-${currentStep}`;
    }

    // Stop the song when moving away from the playlist page
    if (currentStep === 3 && player && typeof player.stopVideo === 'function') {
        player.stopVideo();
        const playerContainer = document.getElementById('youtube-player-container');
        playerContainer.innerHTML = '<p id="player-status">Click a song card to load and play the music!</p>'; 
    }
    
    // Hide current/previous step
    document.getElementById(stepToHideId).classList.add('hidden');
    
    // Show next step
    currentStep = stepNumber;
    document.getElementById(`step-${currentStep}`).classList.remove('hidden');
    window.scrollTo(0, 0); // Scroll to top for new screen
}

/**
 * Handles the opening animation of the love letter envelope
 */
function openEnvelope() {
    const envelope = document.querySelector('.envelope');
    envelope.classList.add('open');
    const clickText = document.querySelector('#step-2 .click-text');
    if (clickText) clickText.style.display = 'none';
    
    setTimeout(() => {
        document.getElementById('continue-2').classList.remove('hidden');
    }, 1500); 
}

/**
 * Handles the flipping of the special message cards
 * @param {HTMLElement} card - The card element that was clicked
 */
function flipCard(card) {
    if (!card.classList.contains('flipped')) {
        messagesDiscovered++;
        updateMessageProgress();
    }
    card.classList.toggle('flipped');
}

/**
 * Updates the message counter and reveals the final letter button when complete
 */
function updateMessageProgress() {
    const progressElement = document.getElementById('message-progress');
    progressElement.textContent = `${messagesDiscovered} of ${totalMessages} messages discovered! Keep exploring ❤️`;

    if (messagesDiscovered >= totalMessages) {
        progressElement.textContent = 'Amazing! You\'ve discovered all the messages! 🎉';
        document.getElementById('continue-4').classList.remove('hidden');
    }
}

/**
 * Shows the popup before the final letter
 */
function showFinalLetterPopup() {
    document.getElementById('final-letter-popup').classList.remove('hidden');
}

/**
 * Hides the popup
 */
function hideFinalLetterPopup(event) {
    if (event) event.preventDefault(); 
    document.getElementById('final-letter-popup').classList.add('hidden');
}

/**
 * Handles the sealing effect (a small delay before showing confirmation)
 */
function sealLetter() {
    const sealButton = document.querySelector('#step-5 button');
    sealButton.textContent = "Sealing your letter...";
    
    setTimeout(() => {
        nextStep(6);
    }, 2000);
}

// --- Playlist Song Click Listener ---
document.addEventListener('DOMContentLoaded', () => {
    const songCards = document.querySelectorAll('.song-card');

    songCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const videoId = e.currentTarget.dataset.videoId;
            
            if (isPlayerReady) {
                if (player && typeof player.loadVideoById === 'function') {
                    player.loadVideoById(videoId);
                } else {
                    loadAndPlayVideo(videoId);
                }
            } else {
                loadAndPlayVideo(videoId);
            }
        });
    });
});