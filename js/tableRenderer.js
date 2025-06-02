import { getRecords, deleteRecord } from './recordManager.js';
import { paginate, formatDuration, formatTime } from './utils.js';
import { renderPagination } from './pagination.js';

const recordTable = document.getElementById('recordTable');
const dailyStats = document.getElementById('dailyStats');
const itemsPerPage = 5;
let currentPage = 1;

export function updateTable() {
  const records = getRecords();
  recordTable.innerHTML = '';

  const today = new Date().toISOString().slice(0, 10);
  const todayRecords = records
    .filter((r) => r.start.slice(0, 10) === today)
    .reverse();

  const pageRecords = paginate(todayRecords, currentPage, itemsPerPage);

  pageRecords.forEach((r, i) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${(currentPage - 1) * itemsPerPage + i + 1}</td>
      <td class="task-column">${r.task}</td>
      <td>${r.category || '未分類'}</td>
      <td>${formatTime(new Date(r.start))}</td>
      <td>${formatTime(new Date(r.end))}</td>
      <td>${formatDuration(new Date(r.end) - new Date(r.start))}</td>
      <td><button class="delete-btn" data-index="${records.indexOf(r)}">🗑️</button></td>
    `;
    recordTable.appendChild(row);
  });

  document.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const index = btn.getAttribute('data-index');
      deleteRecord(index);
      updateTable();
    });
  });

  renderPagination(
    todayRecords.length,
    itemsPerPage,
    currentPage,
    (newPage) => {
      currentPage = newPage;
      updateTable();
    }
  );

  const totalDuration = todayRecords.reduce(
    (sum, r) => sum + (new Date(r.end) - new Date(r.start)),
    0
  );
  const maxDuration = todayRecords.reduce((max, r) => {
    const d = new Date(r.end) - new Date(r.start);
    return Math.max(max, d);
  }, 0);

  dailyStats.innerHTML = `
    <div class="stat-card"><span>今日完成次數</span><span>${todayRecords.length} 次</span></div>
    <div class="stat-card"><span>總專注時間</span><span>${formatDuration(totalDuration)}</span></div>
    <div class="stat-card"><span>最長一次</span><span>${formatDuration(maxDuration)}</span></div>
  `;
}
