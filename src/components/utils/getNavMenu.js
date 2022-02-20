import { statsLink } from '../templates';

export function getNavMenu({ isLogin, userName }) {
  return `
  <ul class="nav-menu">
  <li class="menu menu-item">
    <a class="about-link link" href="#/about">О нас</a>
  </li>
  <li class="menu menu-item">
    <a class="book-link link" href="#/book" id="book">
      Электронный учебник
    </a>
  </li>
  <li class="menu menu-item">
    <a class="games-link link" href="#/games" id="games">
      Мини-игры
    </a>
  </li>
  ${isLogin ? statsLink : ''}
  <li class="menu menu-item ${isLogin ? 'item-hidden' : ''}">
    <a class="login-link link" href="#/login">Войти</a>
  </li>
  <li class="menu menu-item ${isLogin ? 'item-hidden' : ''}">
    <a class="register-link link" href="#/register">Регистрация</a>
  </li>
  <li class="menu menu-item ${isLogin ? '' : 'item-hidden'}">
    <a class="unregister-link link" href="#" id="exit">Выйти</a>
  </li>
  <li class="menu menu-item ${isLogin ? '' : 'item-hidden'}">
    <span class="user-name">${userName}</span>
  </li>
</ul>
  `;
}
