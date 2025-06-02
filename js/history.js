const tableBody = document.getElementById('allRecordsTable');
const pagination = document.getElementById('pagination');
const itemsPerPage = 10;
let currentPage = 1;

function formatTime(dateStr) {
  return new Date(dateStr).toTimeString().slice(0, 8);
}

function formatDuration(ms) {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min} 分 ${sec} 秒`;
}

function getRecords() {
  return JSON.parse(localStorage.getItem('records') || '[]');
}

function paginate(records, page, perPage) {
  const start = (page - 1) * perPage;
  return records.slice(start, start + perPage);
}

function renderTable() {
  const records = getRecords().reverse();
  const pageRecords = paginate(records, currentPage, itemsPerPage);
  tableBody.innerHTML = '';

  pageRecords.forEach((r, i) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${(currentPage - 1) * itemsPerPage + i + 1}</td>
      <td>${r.task}</td>
      <td>${r.category || '未分類'}</td>
      <td>${formatTime(r.start)}</td>
      <td>${formatTime(r.end)}</td>
      <td>${formatDuration(new Date(r.end) - new Date(r.start))}</td>
    `;
    tableBody.appendChild(row);
  });

  renderPagination(records.length);
}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  pagination.innerHTML = '';
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  if (startPage > 1) {
    const firstBtn = createPageButton(1);
    pagination.appendChild(firstBtn);
    if (startPage > 2) {
      const dots = document.createElement('span');
      dots.textContent = '...';
      pagination.appendChild(dots);
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    const btn = createPageButton(i);
    if (i === currentPage) btn.classList.add('active');
    pagination.appendChild(btn);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const dots = document.createElement('span');
      dots.textContent = '...';
      pagination.appendChild(dots);
    }
    const lastBtn = createPageButton(totalPages);
    pagination.appendChild(lastBtn);
  }
}

function createPageButton(page) {
  const btn = document.createElement('button');
  btn.textContent = page;
  btn.addEventListener('click', () => {
    currentPage = page;
    renderTable();
  });
  return btn;
}

renderTable();

document.getElementById('clearAllBtn').addEventListener('click', () => {
  const confirmClear = confirm('你確定要刪除所有紀錄嗎？這個動作無法復原。');
  if (confirmClear) {
    localStorage.removeItem('records');
    renderTable();
  }
});
