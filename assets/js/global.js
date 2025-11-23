// Shrink header on scroll
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
 // Hamburger navMenu
const hamburger = document.getElementById('hamburger');
const navLeft = document.querySelector('.nav-left');
const navRight = document.querySelector('.nav-right');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  const expanded = hamburger.getAttribute('aria-expanded') === 'true' || false;
  hamburger.setAttribute('aria-expanded', !expanded);

  navLeft.classList.toggle('active');
  navRight.classList.toggle('active');
});

// Ham menu closure after tapping an option -- Mobile UX
document.querySelectorAll('.nav-left a, .nav-right a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    navLeft.classList.remove('active');
    navRight.classList.remove('active');
  });
});