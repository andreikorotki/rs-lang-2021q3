import { BaseElement } from '../../common';
import { store } from '../../store';
import { setAuthorized } from '../../store/toolkitReducer';
import { getState, setGroupPage } from '../../services';
import { bgColors } from '../../constants';
import { getNavMenu, getUserExit, setResetActiveLink } from '../../utils';
import { logo } from '../../templates';

export class Header extends BaseElement {
  constructor() {
    super('header', ['header']);
    this.headerContainer = new BaseElement('div', ['header-container']);
    this.navContainer = new BaseElement('nav', ['nav-container']);
    this.element.append(this.headerContainer.element);
    const authorized = getState();
    if (authorized && authorized.message === 'Authenticated') {
      store.dispatch(setAuthorized(true));
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
    const html = `
    <nav class="nav-container">
      ${logo}
      ${getNavMenu(this.state)}
    </nav>
    `;
    this.headerContainer.element.insertAdjacentHTML('beforeend', html);
  };

  handleClicks() {
    this.headerContainer.element.addEventListener('click', this.handleEvents);
  }

  handleEvents = ({ target }) => {
    const { id } = target;
    const [classLink] = target.classList;
    const footer = document.querySelector('.footer');
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
        setGroupPage({ group: 1, page: 1 });
      }
      if (id === 'exit') {
        getUserExit();
      }
    }
  };
}
