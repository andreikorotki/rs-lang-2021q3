import { BaseElement } from '../../common';
import { store } from '../../store';
import { setAuthorized } from '../../store/toolkitReducer';
import { getState } from '../../services';
import { getNavMenu, getUserExit, setResetActiveLink } from '../../utils';
import { bgColors } from '../../constants';

export class Burger extends BaseElement {
  constructor() {
    super('aside', ['burger']);
    this.burgerContainer = new BaseElement('div', ['burger-container']);
    this.navContainer = new BaseElement('nav', ['nav-container_burger']);
    this.burgerContainer.element.append(this.navContainer.element);
    this.span = new BaseElement('span', ['burger-icon']);
    this.element.append(this.span.element);
    this.element.append(this.burgerContainer.element);
    const authorized = getState();
    if (authorized && authorized.message === 'Authenticated') {
      store.dispatch(setAuthorized(true));
    }
    this.state = {
      userName: authorized ? authorized.name : '',
      isLogin: store.getState().toolkit.isLogin
    };
  }

  run() {
    this.handleClick();
  }

  render() {
    this.getNavigationMenu();
    this.run();
    return this.element;
  }

  getNavigationMenu = () => {
    this.navContainer.element.insertAdjacentHTML('afterbegin', getNavMenu(this.state));
  };

  handleClick() {
    this.element.addEventListener('click', this.handleEvents);
  }

  handleEvents = ({ target }) => {
    const { id } = target;
    const [classLink] = target.classList;
    const footer = document.querySelector('.footer');
    if (target.classList.contains('burger') || target.classList.contains('burger-icon')) {
      this.span.element.classList.toggle('active');
      this.burgerContainer.element.classList.toggle('open');
    }
    if (target.classList.contains('open')) {
      this.closeBurger();
    }
    if (target.classList.contains('link') || target.classList.contains('logo')) {
      setResetActiveLink(`.${classLink}`);
      if (id === 'games') {
        footer.style.display = 'none';
      } else {
        footer.style.display = 'block';
      }
      if (id !== 'book') {
        const [mainBgColor] = bgColors;
        document.body.style.background = `${mainBgColor}`;
      }
      if (id === 'exit') {
        getUserExit();
      }
      this.closeBurger();
    }
  };

  closeBurger() {
    this.span.element.classList.toggle('active');
    this.burgerContainer.element.classList.toggle('open');
  }
}
