import { BaseElement } from '../../common';
import logo from '../../../../assets/icons/rs-logo.svg';

export class Footer extends BaseElement {
  constructor() {
    super('footer', ['footer']);
    this.footerContainer = new BaseElement('div', ['footer-container']);
    this.element.appendChild(this.footerContainer.element);
  }

  render() {
    this.getFooterNavigation();
    return this.element;
  }

  getFooterNavigation = () => {
    const html = `
      <nav class="nav-container footer">
        <ul class="nav-menu_footer">
          <li class="menu-item">
            <a class="link footer-link" href="https://github.com/andreikorotki">
              Andrei
            </a>
          </li>
          <li class="menu-item">
            <a class="link footer-link" href="https://github.com/VVK1978">
              Viktar
            </a>
          </li>
          <li class="menu-item">
            <a class="link footer-link" href="#">
              Anton
            </a>
          </li>
        </ul>
        <div class="school-year">
        <p class="app-year footer-link">2022</p>
        <a class="link" href="https://rs.school/js/">
          <img src="${logo}" class="school-logo"/>
        </a>
        </div>
      </nav>
    `;
    this.footerContainer.element.insertAdjacentHTML('beforeend', html);
  };
}
