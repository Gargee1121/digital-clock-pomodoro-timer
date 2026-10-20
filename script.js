const clockDisplay = document.getElementById('digital-clock');
const timerDisplay = document.getElementById('pomodoro-timer');
const workBtn = document.getElementById('work-mode');
const breakBtn = document.getElementById('break-mode');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const workInput = document.getElementById('work-input');
const breakInput = document.getElementById('break-input');
const openSettings = document.getElementById('open-settings');
const closeSettings = document.getElementById('close-settings');
const modal = document.getElementById('settings-modal');
const progressBar = document.getElementById('progress-bar');
const ambientGlow = document.getElementById('ambient-glow');

const radius = progressBar.r.baseVal.value;
const circumference = radius * 2 * Math.PI;

progressBar.style.strokeDasharray = `${circumference} ${circumference}`;
progressBar.style.strokeDashoffset = 0;

let timerInterval = null;
let totalTime = workInput.value * 60;
let timeLeft = totalTime;
let currentMode = 'work';

function setProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    progressBar.style.strokeDashoffset = offset;
}

function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = String(hours).padStart(2, '0');

    clockDisplay.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
}

function updateTimerDisplay() {
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
    
    const percent = (timeLeft / totalTime) * 100;
    setProgress(percent);
}

function startTimer() {
    if (timerInterval !== null) return;
    
    ambientGlow.classList.add('running');
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            timerInterval = null;
            ambientGlow.classList.remove('running');
            alert(currentMode === 'work' ? 'Time for a break!' : 'Back to work!');
            resetTimer();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    ambientGlow.classList.remove('running');
}

function resetTimer() {
    pauseTimer();
    const workMinutes = parseInt(workInput.value) || 25;
    const breakMinutes = parseInt(breakInput.value) || 5;
    totalTime = currentMode === 'work' ? workMinutes * 60 : breakMinutes * 60;
    timeLeft = totalTime;
    updateTimerDisplay();
}

function switchMode(mode) {
    currentMode = mode;
    if (mode === 'work') {
        workBtn.classList.add('active');
        breakBtn.classList.remove('active');
        progressBar.style.stroke = '#ff0055';
        ambientGlow.style.background = 'radial-gradient(circle, rgba(255, 0, 85, 0.15) 0%, transparent 70%)';
        workBtn.style.background = '#ff0055';
        workBtn.style.borderColor = '#ff0055';
        breakBtn.style.background = 'transparent';
        breakBtn.style.borderColor = 'rgba(255, 255, 255, 0.08)';
    } else {
        breakBtn.classList.add('active');
        workBtn.classList.remove('active');
        progressBar.style.stroke = '#00ffaa';
        ambientGlow.style.background = 'radial-gradient(circle, rgba(0, 255, 170, 0.15) 0%, transparent 70%)';
        breakBtn.style.background = '#00ffaa';
        breakBtn.style.borderColor = '#00ffaa';
        workBtn.style.background = 'transparent';
        workBtn.style.borderColor = 'rgba(255, 255, 255, 0.08)';
    }
    resetTimer();
}

openSettings.addEventListener('click', () => modal.classList.add('open'));
closeSettings.addEventListener('click', () => {
    modal.classList.remove('open');
    resetTimer();
});

workBtn.addEventListener('click', () => switchMode('work'));
breakBtn.addEventListener('click', () => switchMode('break'));
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

setInterval(updateClock, 1000);
updateClock();
updateTimerDisplay();
