import { BaseElement } from '../../common';
import { store } from '../../store';
import { setAuthorized } from '../../store/toolkitReducer';
import { getState } from '../../services';

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
          <a class="link about-link" href="/#/about">О нас</a>
        </li>
        <li class="menu-item">
          <a class="link book-link" href="/#/book" id="book">
            Электронный учебник
          </a>
        </li>
        <li class="menu-item">
          <a class="link games-link" href="/#/games" id="games">
            Мини-игры
          </a>
        </li>
        ${this.state.isLogin ? stats : ''}
        <li class="menu-item ${this.state.isLogin ? 'item-hidden' : ''}">
          <a class="link login-link" href="/#/login">Войти</a>
        </li>
        <li class="menu-item ${this.state.isLogin ? 'item-hidden' : ''}">
          <a class="link register-link" href="/#/register">Регистрация</a>
        </li>
        <li class="menu-item ${this.state.isLogin ? '' : 'item-hidden'}">
          <a class="link register-link" href="#">Выйти</a>
        </li>
      </ul>
    </nav>
    `;
    this.headerContainer.element.insertAdjacentHTML('beforeend', html);
  };

  handleClicks() {
    this.headerContainer.element.addEventListener('click', (event) => this.handleEvents(event));
  }

  handleEvents = ({ target }) => {
    const footer = document.querySelector('.footer');
    if (target.classList.contains('link') || target.classList.contains('logo')) {
      this.setRemoveActiveLink(target);
      if (target.id === 'games') {
        footer.style.display = 'none';
      } else {
        footer.style.display = 'block';
      }
      if (target.id !== 'book') {
        document.body.style.background = '#ffffff';
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
}
