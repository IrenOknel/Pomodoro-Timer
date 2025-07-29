let focusDuration = 25 * 60;
let breakDuration = 5 * 60;
let timeLeft = focusDuration;
let currentMode = "focus";
let isRunning = false;
let timerInterval;

const alarmSound = new Audio("alarm-laugh.wav");

const timeDisplay = document.getElementById("time-display");
const sessionLabel = document.getElementById("session-label");
const focusInput = document.getElementById("focus-input");
const shortInput = document.getElementById("short-input");
const editButton = document.getElementById("edit-settings");
const saveMsg = document.getElementById("save-msg");
const ringFill = document.querySelector(".ring-fill");
const tomatoIcon = document.querySelector(".tomato-icon");

const RADIUS = 110;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
ringFill.style.strokeDasharray = `${CIRCUMFERENCE}`;
ringFill.style.strokeDashoffset = `${CIRCUMFERENCE}`;

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timeDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  const totalTime = currentMode === "focus" ? focusDuration : breakDuration;
  const percent = timeLeft / totalTime;
  const offset = CIRCUMFERENCE * (1 - percent);
  ringFill.style.strokeDashoffset = offset;
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    updateDisplay();

    if (timeLeft <= 0) {
      alarmSound.play().catch((e) => console.warn("Sound blocked", e));
      switchMode();
    }
  }, 1000);

  if (currentMode === "focus") tomatoIcon.classList.add("jump");
  isRunning = true;
}

function stopTimer() {
  clearInterval(timerInterval);
  tomatoIcon.classList.remove("jump");
  isRunning = false;
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
  startTimer();
}

document.getElementById("start-btn").addEventListener("click", () => {
  if (!isRunning) startTimer();
});

document.getElementById("pause-btn").addEventListener("click", () => {
  if (isRunning) stopTimer();
});

document.getElementById("reset-btn").addEventListener("click", () => {
  stopTimer();
  timeLeft = currentMode === "focus" ? focusDuration : breakDuration;
  updateDisplay();
});

editButton.addEventListener("click", () => {
  const editing = focusInput.disabled;

  if (editing) {
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

focusInput.value = focusDuration / 60;
shortInput.value = breakDuration / 60;
updateDisplay();
