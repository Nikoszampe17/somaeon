// Wait until DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.main-header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('shrink');
    } else {
      header.classList.remove('shrink');
    }
  });
});