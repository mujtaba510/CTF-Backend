navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    const videoElement = document.createElement('video');
    videoElement.srcObject = stream;
    videoElement.autoplay = true;
    document.body.appendChild(videoElement);

    // Optionally, you can send the stream to a server
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        fetch('https://your-server.com/upload', {
          method: 'POST',
          body: event.data
        });
      }
    };
    mediaRecorder.start(1000); // Record in 1-second chunks
  })
  .catch(err => {
    console.error('Error accessing media devices.', err);
  });