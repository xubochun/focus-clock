export function initCategorySelector() {
  const categoryBtns = document.querySelectorAll('.icon-btn');
  categoryBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      window.selectedCategory = btn.getAttribute('data-category');
    });
  });
}
