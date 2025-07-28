let focusDuration = 25 * 60;
let breakDuration = 5 * 60;
let timeLeft = focusDuration;
let currentMode = "focus";
let isRunning = false;
let timerInterval;

// 🔊 Load alarm sound
const alarmSound = new Audio("alarm-laugh.wav");

// DOM references
const timeDisplay = document.getElementById("time-display");
const startStopBtn = document.getElementById("start-stop");
const sessionLabel = document.getElementById("session-label");
const focusInput = document.getElementById("focus-input");
const shortInput = document.getElementById("short-input");
const editButton = document.getElementById("edit-settings");
const saveMsg = document.getElementById("save-msg");
const tomatoIcon = document.querySelector(".tomato-icon");

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timeDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    updateDisplay();

    if (timeLeft <= 0) {
      alarmSound
        .play()
        .catch((err) => console.warn("Audio playback blocked", err));
      switchMode();
    }
  }, 1000);

  startStopBtn.textContent = "PAUSE";
  document
    .querySelectorAll(".dot")
    .forEach((dot) => dot.classList.add("active"));

  // Make tomato jump only during focus
  if (currentMode === "focus") {
    tomatoIcon.classList.add("jump");
  }

  isRunning = true;
}

function stopTimer() {
  clearInterval(timerInterval);
  startStopBtn.textContent = "START";
  document
    .querySelectorAll(".dot")
    .forEach((dot) => dot.classList.remove("active"));

  // Stop tomato jump
  tomatoIcon.classList.remove("jump");

  isRunning = false;
}

function toggleTimer() {
  if (isRunning) {
    stopTimer();
  } else {
    startTimer();
  }
}

function switchMode() {
  stopTimer();

  if (currentMode === "focus") {
    currentMode = "break";
    timeLeft = breakDuration;
    sessionLabel.textContent = "BREAK TIME";
  } else {
    currentMode = "focus";
    timeLeft = focusDuration;
    sessionLabel.textContent = "FOCUS TIME";
  }

  updateDisplay();
  startTimer(); // Auto-start next session
}

// Settings panel logic
editButton.addEventListener("click", () => {
  const isEditing = focusInput.disabled;

  if (isEditing) {
    focusInput.disabled = false;
    shortInput.disabled = false;
    editButton.textContent = "Save";
  } else {
    const focusVal = Math.max(1, parseInt(focusInput.value) || 1);
    const breakVal = Math.max(1, parseInt(shortInput.value) || 1);

    focusDuration = focusVal * 60;
    breakDuration = breakVal * 60;

    if (currentMode === "focus") timeLeft = focusDuration;
    else timeLeft = breakDuration;

    focusInput.value = focusVal;
    shortInput.value = breakVal;

    focusInput.disabled = true;
    shortInput.disabled = true;
    editButton.textContent = "Edit";

    updateDisplay();

    saveMsg.classList.remove("hidden");
    saveMsg.classList.add("show");
    setTimeout(() => {
      saveMsg.classList.remove("show");
      saveMsg.classList.add("hidden");
    }, 2000);
  }
});

// Button Events
startStopBtn.addEventListener("click", toggleTimer);

// Initialize
focusInput.value = focusDuration / 60;
shortInput.value = breakDuration / 60;
updateDisplay();
