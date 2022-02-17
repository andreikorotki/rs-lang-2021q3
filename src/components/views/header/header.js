import { BaseElement } from '../../common';
import { store } from '../../store';
import { setAuthorized } from '../../store/toolkitReducer';
import { getState } from '../../services';
import { bgColors } from '../../constants';
import { renderHeader } from '../../utils';
import { NAME_LOCAL_STORAGE } from '../../services/settings';

export class Header extends BaseElement {
  constructor() {
    super('header', ['header']);
    this.headerContainer = new BaseElement('div', ['header-container']);
    this.navContainer = new BaseElement('nav', ['nav-container']);
    this.element.append(this.headerContainer.element);
    const authorized = getState();
    if (authorized) {
      if (authorized.message === 'Authenticated') {
        store.dispatch(setAuthorized(true));
      }
    }
    this.state = {
      userName: authorized ? authorized.name : '',
      isLogin: store.getState().toolkit.isLogin
    };
  }

  render() {
    this.getNavigationMenu();
    this.run();
    return this.element;
  }

  run() {
    this.handleClicks();
  }

  getNavigationMenu = () => {
    const { isLogin, userName } = this.state;
    const stats = `
            <li class="menu-item">
              <a class="link stats-link" href="/#/stats">
                Статистика
              </a>
            </li>
          `;
    const html = `
    <nav class="nav-container">
      <div class="logo">
        <a class="logo-link link" href="#">
          <h1 class="logo">
            RS Lang
          </h1>
        </a>
      </div>

      <ul class="nav-menu">
        <li class="menu-item">
          <a class="link about-link" href="#/about">О нас</a>
        </li>
        <li class="menu-item">
          <a class="link book-link" href="#/book" id="book">
            Учебник
          </a>
        </li>
        <li class="menu-item">
          <a class="link games-link" href="#/games" id="games">
            Мини-игры
          </a>
        </li>
        ${isLogin ? stats : ''}
        <li class="menu-item ${isLogin ? 'item-hidden' : ''}">
          <a class="link login-link" href="#/login">Войти</a>
        </li>
        <li class="menu-item ${isLogin ? 'item-hidden' : ''}">
          <a class="link register-link" href="#/register">Регистрация</a>
        </li>
        <li class="menu-item ${isLogin ? '' : 'item-hidden'}">
          <a class="link unregister-link" href="#" id="exit">Выйти</a>
        </li>
        <li class="menu-item ${isLogin ? '' : 'item-hidden'}">
          <span class="user-name">${userName}</span>
        </li>
      </ul>
    </nav>
    `;
    this.headerContainer.element.insertAdjacentHTML('beforeend', html);
  };

  handleClicks() {
    this.headerContainer.element.addEventListener('click', this.handleEvents);
  }

  handleEvents = ({ target }) => {
    const { id } = target;
    const footer = document.querySelector('.footer');
    if (target.classList.contains('link') || target.classList.contains('logo')) {
      this.setRemoveActiveLink(target);
      if (id === 'games') {
        footer.style.display = 'none';
      } else {
        footer.style.display = 'block';
      }
      if (id !== 'book') {
        const mainBgColor = bgColors[0];
        document.body.style.background = `${mainBgColor}`;
      }
      if (id === 'exit') {
        this.getUserExit();
      }
    }
  };

  setRemoveActiveLink = (target) => {
    const links = document.querySelectorAll('.link');
    links.forEach((link) => {
      if (link.classList.contains('active')) {
        link.classList.remove('active');
      }
    });
    target.classList.add('active');
  };

  getUserExit = () => {
    localStorage.clear(`${NAME_LOCAL_STORAGE}`);
    store.dispatch(setAuthorized(false));
    renderHeader();
  };
}
