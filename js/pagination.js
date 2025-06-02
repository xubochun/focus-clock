export function renderPagination(
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange
) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';
  const maxVisible = 5;

  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  if (startPage > 1) {
    const firstBtn = document.createElement('button');
    firstBtn.textContent = '1';
    firstBtn.addEventListener('click', () => onPageChange(1));
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
    btn.addEventListener('click', () => onPageChange(i));
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
    lastBtn.addEventListener('click', () => onPageChange(totalPages));
    pagination.appendChild(lastBtn);
  }
}
