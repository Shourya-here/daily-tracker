let data = JSON.parse(localStorage.getItem("trackerData")) || {};
let activeSubject = null;
let timer = null;
let startTime = null;

const subjectsContainer = document.getElementById("subjectsContainer");
const timerDisplay = document.getElementById("timerDisplay");
const activeLabel = document.getElementById("activeSubject");
const datePicker = document.getElementById("datePicker");
const dateSummary = document.getElementById("dateSummary");

const today = new Date().toISOString().split("T")[0];
datePicker.value = today;

/* Utilities */
function formatTime(ms) {
  let sec = Math.floor(ms / 1000);
  let h = String(Math.floor(sec / 3600)).padStart(2, "0");
  let m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  let s = String(sec % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function save() {
  localStorage.setItem("trackerData", JSON.stringify(data));
  renderSubjects();
  renderDateSummary();
}

/* Render Subjects */
function renderSubjects() {
  subjectsContainer.innerHTML = "";
  Object.keys(data).forEach(sub => {
    const div = document.createElement("div");
    div.className = "subject" + (sub === activeSubject ? " active" : "");
    div.innerHTML = `
      <span>${sub}</span>
      <button onclick="selectSubject('${sub}')">▶</button>
    `;
    subjectsContainer.appendChild(div);
  });
}

/* Subject Actions */
function selectSubject(name) {
  stopTimer();
  activeSubject = name;
  activeLabel.textContent = `Active: ${name}`;
  renderSubjects();
}

/* Timer Logic */
function startTimer() {
  if (!activeSubject || timer) return;
  startTime = Date.now();
  timer = setInterval(updateTimer, 1000);
}

function pauseTimer() {
  if (!timer) return;
  addTime(Date.now() - startTime);
  stopTimer();
  save();
}

function resumeTimer() {
  if (!activeSubject || timer) return;
  startTime = Date.now();
  timer = setInterval(updateTimer, 1000);
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
  startTime = null;
  timerDisplay.textContent = "00:00:00";
}

function updateTimer() {
  timerDisplay.textContent = formatTime(Date.now() - startTime);
}

/* Add Time */
function addTime(ms) {
  if (!data[activeSubject]) data[activeSubject] = {};
  if (!data[activeSubject][today]) data[activeSubject][today] = 0;
  data[activeSubject][today] += ms;
}

/* Calendar Summary */
function renderDateSummary() {
  const date = datePicker.value;
  let html = "";

  Object.keys(data).forEach(sub => {
    if (data[sub][date]) {
      html += `<p><strong>${sub}</strong>: ${formatTime(data[sub][date])}</p>`;
    }
  });

  dateSummary.innerHTML = html || "<p>No data for this date</p>";
}

/* Add Subject */
document.getElementById("addSubjectBtn").onclick = () => {
  const input = document.getElementById("subjectInput");
  if (input.value && !data[input.value]) {
    data[input.value] = {};
    input.value = "";
    save();
  }
};

/* Buttons */
document.getElementById("startBtn").onclick = startTimer;
document.getElementById("pauseBtn").onclick = pauseTimer;
document.getElementById("resumeBtn").onclick = resumeTimer;
datePicker.onchange = renderDateSummary;

/* Init */
renderSubjects();
renderDateSummary();
