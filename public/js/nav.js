const menuIcon = document.getElementById('menu-icon');
const navList = document.getElementById('nav-list');
const wrapper = document.querySelector('.shop-wrapper');

menuIcon.addEventListener('click', () => {
  navList.classList.toggle('open');
  wrapper.classList.toggle('lock');
  menuIcon.classList.toggle('ri-menu-line');
  menuIcon.classList.toggle('ri-close-line');
});
