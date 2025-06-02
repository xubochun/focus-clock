import { saveRecord } from './recordManager.js';
import { updateTable } from './tableRenderer.js';

const toggleBtn = document.getElementById('toggleBtn');
const taskInput = document.getElementById('taskName');
const statusText = document.getElementById('status');
const elapsedDisplay = document.getElementById('elapsed');

let startTime = null;
let timerInterval = null;
window.isRunning = false;

export function startTimer() {
  const task = taskInput.value.trim();
  if (!task) return alert('請輸入任務名稱');
  startTime = new Date();
  window.isRunning = true;

  toggleBtn.innerHTML = '結束 <span class="loading-spinner"></span>';
  toggleBtn.classList.remove('btn-start');
  toggleBtn.classList.add('btn-stop');
  taskInput.disabled = true;
  statusText.textContent = '正在計時中...';
  timerInterval = setInterval(updateElapsed, 1000);
}

export function stopTimer() {
  const endTime = new Date();
  clearInterval(timerInterval);
  window.isRunning = false;

  toggleBtn.textContent = '開始';
  toggleBtn.classList.remove('btn-stop');
  toggleBtn.classList.add('btn-start');
  taskInput.disabled = false;
  statusText.textContent = '尚未開始';
  elapsedDisplay.textContent = '00:00';

  saveRecord({
    task: taskInput.value.trim(),
    category: window.selectedCategory || '未分類',
    start: startTime.toISOString(),
    end: endTime.toISOString()
  });

  updateTable();
}

function updateElapsed() {
  const diff = new Date() - startTime;
  const min = String(Math.floor(diff / 60000)).padStart(2, '0');
  const sec = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
  elapsedDisplay.textContent = `${min}:${sec}`;
}
