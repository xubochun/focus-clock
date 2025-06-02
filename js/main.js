import { startTimer, stopTimer } from './timer.js';
import { updateTable } from './tableRenderer.js';
import { initCategorySelector } from './categorySelector.js';

document.addEventListener('DOMContentLoaded', () => {
  initCategorySelector();
  updateTable();

  const toggleBtn = document.getElementById('toggleBtn');
  toggleBtn.addEventListener('click', () => {
    if (!window.isRunning) {
      startTimer();
    } else {
      stopTimer();
    }
  });
});

document.getElementById('viewAllBtn').addEventListener('click', () => {
  window.location.href = 'history.html'
});
