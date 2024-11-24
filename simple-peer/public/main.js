const socket = io();
const joinContainer = document.getElementById("join-container");
const videoContainer = document.getElementById("video-container");
const roomInput = document.getElementById("roomInput");
const joinButton = document.getElementById("joinButton");
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const muteAudioButton = document.getElementById("muteAudioButton");
const muteVideoButton = document.getElementById("muteVideoButton");
let localStream;
let peer;
let audioMuted = false;
let videoMuted = false;

joinButton.addEventListener("click", () => {
  const roomName = roomInput.value;
  if (roomName) {
    socket.emit("join-room", roomName);
    joinContainer.style.display = "none";
    videoContainer.style.display = "flex";
    initializePeer();
  }
});

muteAudioButton.addEventListener("click", () => {
  audioMuted = !audioMuted;
  localStream.getAudioTracks()[0].enabled = !audioMuted;
  muteAudioButton.textContent = audioMuted ? "Unmute Audio" : "Mute Audio";
});

muteVideoButton.addEventListener("click", () => {
  videoMuted = !videoMuted;
  localStream.getVideoTracks()[0].enabled = !videoMuted;
  muteVideoButton.textContent = videoMuted ? "Unmute Video" : "Mute Video";
});

socket.on("connect", () => {
  console.log("Connected to signaling server");
});

socket.on("signal", (data) => {
  peer.signal(data);
});

socket.on("joined-room", () => {
  initializePeer();
});

const shareScreenButton = document.getElementById("shareScreenButton");

shareScreenButton.addEventListener("click", () => {
  navigator.mediaDevices
    .getDisplayMedia({ video: true })
    .then((screenStream) => {
      peer.replaceTrack(
        localStream.getVideoTracks()[0],
        screenStream.getVideoTracks()[0],
        localStream
      );
      localVideo.srcObject = screenStream;

      screenStream.getVideoTracks()[0].addEventListener("ended", () => {
        peer.replaceTrack(
          screenStream.getVideoTracks()[0],
          localStream.getVideoTracks()[0],
          localStream
        );
        localVideo.srcObject = localStream;
      });
    })
    .catch((error) => {
      console.error("Error sharing screen:", error);
    });
});

const remoteVideos = document.getElementById("remoteVideos");
let peers = {};

joinButton.addEventListener("click", () => {
  const roomName = roomInput.value;
  if (roomName) {
    socket.emit("join-room", roomName);
    joinContainer.style.display = "none";
    videoContainer.style.display = "flex";
    initializePeer();
  }
});

function initializePeer(isInitiator = false, peerId) {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((stream) => {
      localVideo.srcObject = stream;
      localStream = stream;

      const peer = new SimplePeer({
        initiator: isInitiator,
        trickle: false,
        stream: localStream,
      });

      peer.on("signal", (data) => {
        socket.emit("signal", { peerId, data });
      });

      peer.on("stream", (stream) => {
        addRemoteStream(stream, peerId);
      });

      peer.on("data", (data) => {
        console.log("Received message:", data.toString());
      });

      peer.on("error", (err) => {
        console.error("Peer error:", err);
      });

      peers[peerId] = peer;
    })
    .catch((error) => {
      console.error("Error accessing media devices.", error);
      alert(
        "Could not access your camera and microphone. Please ensure they are connected and enabled."
      );
    });
}

socket.on("connect", () => {
  console.log("Connected to signaling server");
});

socket.on("signal", ({ peerId, data }) => {
  if (!peers[peerId]) {
    initializePeer(false, peerId);
  }
  peers[peerId].signal(data);
});

socket.on("joined-room", ({ peerId }) => {
  initializePeer(true, peerId);
});

function addRemoteStream(stream, peerId) {
  const videoElement = document.createElement("video");
  videoElement.id = `video-${peerId}`;
  videoElement.srcObject = stream;
  videoElement.autoplay = true;
  remoteVideos.appendChild(videoElement);
}

socket.on("peer-disconnected", (peerId) => {
  const videoElement = document.getElementById(`video-${peerId}`);
  if (videoElement) {
    videoElement.remove();
  }
  delete peers[peerId];
});
