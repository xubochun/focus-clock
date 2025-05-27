const toggleBtn = document.getElementById('toggleBtn');
const statusText = document.getElementById('status');
const elapsedDisplay = document.getElementById('elapsed');
const taskInput = document.getElementById('taskName');
const recordTable = document.getElementById('recordTable');
const dailyStats = document.getElementById('dailyStats');
const categoryBtns = document.querySelectorAll('.icon-btn');
const pagination = document.getElementById('pagination');
let selectedCategory = '';
let currentPage = 1;
const itemsPerPage = 5;

categoryBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        categoryBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        selectedCategory = btn.getAttribute('data-category');
    });
});

let startTime = null;
let timerInterval = null;
let isRunning = false;
let records = JSON.parse(localStorage.getItem('records') || '[]');

function formatTime(date) {
    return date.toTimeString().slice(0, 8);
}

function formatDuration(ms) {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min} 分 ${sec} 秒`;
}

function paginate(records, page, perPage) {
    const start = (page - 1) * perPage;
    return records.slice(start, start + perPage);
}

function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    pagination.innerHTML = '';
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
        const firstBtn = document.createElement('button');
        firstBtn.textContent = '1';
        firstBtn.addEventListener('click', () => {
            currentPage = 1;
            updateTable();
        });
        pagination.appendChild(firstBtn);
        if (startPage > 2) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            pagination.appendChild(dots);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        if (i === currentPage) btn.classList.add('active');
        btn.addEventListener('click', () => {
            currentPage = i;
            updateTable();
        });
        pagination.appendChild(btn);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            pagination.appendChild(dots);
        }
        const lastBtn = document.createElement('button');
        lastBtn.textContent = totalPages;
        lastBtn.addEventListener('click', () => {
            currentPage = totalPages;
            updateTable();
        });
        pagination.appendChild(lastBtn);
    }
}

function updateTable() {
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
          <td><button class="delete-btn" data-index="${records.indexOf(r)}">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 24 24">
    <path d="M9 3V4H4V6H5V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V6H20V4H15V3H9ZM7 6H17V20H7V6ZM9 8V18H11V8H9ZM13 8V18H15V8H13Z"/>
  </svg>
</button></td>
        `;
        recordTable.appendChild(row);
    });

    document.querySelectorAll('.delete-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            records.splice(index, 1);
            localStorage.setItem('records', JSON.stringify(records));
            updateTable();
        });
    });

    renderPagination(todayRecords.length);

    const totalDuration = todayRecords.reduce(
        (sum, r) => sum + (new Date(r.end) - new Date(r.start)),
        0
    );
    const maxDuration = todayRecords.reduce((max, r) => {
        const d = new Date(r.end) - new Date(r.start);
        return Math.max(max, d);
    }, 0);

    dailyStats.innerHTML = `
        <div class="stat-card"><span>今日完成次數</span><span>${todayRecords.length
        } 次</span></div>
        <div class="stat-card"><span>總專注時間</span><span>${formatDuration(
            totalDuration
        )}</span></div>
        <div class="stat-card"><span>最長一次</span><span>${formatDuration(
            maxDuration
        )}</span></div>
      `;
}

toggleBtn.addEventListener('click', () => {
    if (!isRunning) {
        const task = taskInput.value.trim();
        if (!task) return alert('請輸入任務名稱');
        startTime = new Date();
        isRunning = true;
        toggleBtn.innerHTML = '結束 <span class="loading-spinner"></span>';
        toggleBtn.classList.remove('btn-start');
        toggleBtn.classList.add('btn-stop');
        taskInput.disabled = true;
        statusText.textContent = '正在計時中...';
        timerInterval = setInterval(updateElapsed, 1000);
    } else {
        const endTime = new Date();
        clearInterval(timerInterval);
        isRunning = false;
        toggleBtn.textContent = '開始';
        toggleBtn.classList.remove('btn-stop');
        toggleBtn.classList.add('btn-start');
        taskInput.disabled = false;
        statusText.textContent = '尚未開始';
        elapsedDisplay.textContent = '00:00';
        records.push({
            task: taskInput.value.trim(),
            category: selectedCategory || '未分類',
            start: startTime.toISOString(),
            end: endTime.toISOString(),
        });
        localStorage.setItem('records', JSON.stringify(records));
        updateTable();
    }
});

function updateElapsed() {
    const diff = new Date() - startTime;
    const min = String(Math.floor(diff / 60000)).padStart(2, '0');
    const sec = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    elapsedDisplay.textContent = `${min}:${sec}`;
}

updateTable();