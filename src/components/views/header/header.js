import BaseElement from '../../common/base-element';

export class Header extends BaseElement {
  constructor() {
    super('header', ['header']);
    this.headerContainer = new BaseElement('div', ['header-container']);
    this.navContainer = new BaseElement('nav', ['nav-container']);
    this.headerHeading = new BaseElement('h3', ['app-heading']);
    this.headerHeading.element.innerText = 'RS Lang';
    this.logoContainer = new BaseElement('div', ['logo']);
    this.logoContainer.element.innerHTML = '';
    this.headerContainer.element.appendChild(this.headerHeading.element);
    this.headerContainer.element.appendChild(this.logoContainer.element);
    this.headerContainer.element.appendChild(this.navContainer.element);
    this.element.appendChild(this.headerContainer.element);
  }

  render() {
    return this.element;
  }
}
