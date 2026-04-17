const MEMES = {
  staring: "memes/staring.jpg",
  thinking: "memes/thinking.jpg",
  pointing: "memes/pointing.jpg",
  shocked: "memes/shocked.jpg",
};

const TOUCH_THRESHOLD = 0.08;
const POINTING_OFFSET = 0.05;
const MOUTH_OPEN_THRESHOLD = 0.5;

const videoEl = document.getElementById("cameraVideo");
const canvasEl = document.getElementById("cameraCanvas");
const canvasCtx = canvasEl.getContext("2d");
const memeViewEl = document.getElementById("memeView");
const poseBadgeEl = document.getElementById("poseBadge");
const moodTextEl = document.getElementById("moodText");
const startBtnEl = document.getElementById("startBtn");
const statusTextEl = document.getElementById("statusText");
const introNameEl = document.getElementById("introName");
const shareHintEl = document.getElementById("shareHint");

let holistic = null;
let stream = null;
let activePose = "staring";
let frameLoopActive = false;

const moodMap = {
  staring: "neutral stare",
  thinking: "hmm... plotting",
  pointing: "calling it out",
  shocked: "caught in 4K",
};

function clampName(name) {
  if (!name) return "OYO";
  return name.replace(/[^a-zA-Z0-9 _.-]/g, "").trim().slice(0, 24) || "OYO";
}

function getNameFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return clampName(params.get("name"));
}

function setNameUi() {
  const name = getNameFromUrl();
  introNameEl.textContent = name;

  const shareUrl = new URL(window.location.href);
  shareUrl.searchParams.set("name", name);
  shareHintEl.textContent = shareUrl.toString();
}

function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

function getFinger(handLandmarks, fingerIndex = 8) {
  if (!handLandmarks || !handLandmarks[fingerIndex]) return null;
  return handLandmarks[fingerIndex];
}

function mouthOpenRatio(faceLandmarks) {
  if (!faceLandmarks || !faceLandmarks[13] || !faceLandmarks[14] || !faceLandmarks[78] || !faceLandmarks[308]) {
    return 0;
  }

  const upperLip = faceLandmarks[13];
  const lowerLip = faceLandmarks[14];
  const leftCorner = faceLandmarks[78];
  const rightCorner = faceLandmarks[308];

  const vertical = distance(upperLip, lowerLip);
  const horizontal = distance(leftCorner, rightCorner);
  return horizontal === 0 ? 0 : vertical / horizontal;
}

function detectPose(results) {
  const poseLandmarks = results.poseLandmarks;
  if (!poseLandmarks) return "staring";

  const nose = poseLandmarks[0];
  const leftMouth = poseLandmarks[9];
  const rightMouth = poseLandmarks[10];
  const shoulderY = (poseLandmarks[11].y + poseLandmarks[12].y) / 2;

  const rightFinger = getFinger(results.rightHandLandmarks);
  const leftFinger = getFinger(results.leftHandLandmarks);
  const mouthRatio = mouthOpenRatio(results.faceLandmarks);

  let detected = "staring";

  if (rightFinger) {
    const dist = distance(rightFinger, rightMouth);
    if (dist < TOUCH_THRESHOLD && rightFinger.y < shoulderY) {
      detected = "thinking";
    }
  }

  if (detected === "staring" && leftFinger) {
    const dist = distance(leftFinger, leftMouth);
    if (dist < TOUCH_THRESHOLD && leftFinger.y < shoulderY) {
      detected = "thinking";
    }
  }

  if (detected === "staring") {
    if (rightFinger && rightFinger.y < nose.y - POINTING_OFFSET) {
      detected = "pointing";
    } else if (leftFinger && leftFinger.y < nose.y - POINTING_OFFSET) {
      detected = "pointing";
    }
  }

  if (detected === "staring" && mouthRatio > MOUTH_OPEN_THRESHOLD) {
    detected = "shocked";
  }

  return detected;
}

function updatePoseUi(pose) {
  if (pose === activePose) return;

  activePose = pose;
  poseBadgeEl.textContent = pose.toUpperCase();
  moodTextEl.textContent = moodMap[pose] || "neutral stare";
  memeViewEl.src = MEMES[pose];

  memeViewEl.classList.remove("bump");
  requestAnimationFrame(() => memeViewEl.classList.add("bump"));
}

function onResults(results) {
  if (!results.image) return;

  if (canvasEl.width !== results.image.width || canvasEl.height !== results.image.height) {
    canvasEl.width = results.image.width;
    canvasEl.height = results.image.height;
  }

  canvasCtx.save();
  canvasCtx.drawImage(results.image, 0, 0, canvasEl.width, canvasEl.height);
  canvasCtx.restore();

  const pose = detectPose(results);
  updatePoseUi(pose);
}

async function initHolistic() {
  holistic = new Holistic({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
  });

  holistic.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6,
    refineFaceLandmarks: true,
    selfieMode: true,
  });

  holistic.onResults(onResults);
}

async function startCamera() {
  stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: "user",
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
    audio: false,
  });

  videoEl.srcObject = stream;
  await videoEl.play();
}

async function runFrameLoop() {
  if (frameLoopActive) return;
  frameLoopActive = true;

  const tick = async () => {
    if (!frameLoopActive) return;
    if (videoEl.readyState >= 2) {
      await holistic.send({ image: videoEl });
    }
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

async function startApp() {
  startBtnEl.disabled = true;
  statusTextEl.textContent = "Starting camera and pose model...";

  try {
    if (!holistic) {
      await initHolistic();
    }

    if (!stream) {
      await startCamera();
    }

    await runFrameLoop();
    statusTextEl.textContent = "Live. Strike a pose.";
    startBtnEl.textContent = "Camera Enabled";
  } catch (error) {
    startBtnEl.disabled = false;
    startBtnEl.textContent = "Enable Camera";
    statusTextEl.textContent = `Camera blocked or unavailable: ${error.message}`;
  }
}

startBtnEl.addEventListener("click", startApp);
setNameUi();
