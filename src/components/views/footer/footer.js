import BaseElement from '../../common/base-element';

export class Footer extends BaseElement {
  constructor() {
    super('footer', ['footer']);
    this.footerContainer = new BaseElement('div', ['footer-container']);
    this.linksContainer = new BaseElement('div', ['gh-links']);
    this.footerHeading = new BaseElement('h3', ['app-heading']);
    this.footerHeading.element.innerText = 'RS Lang';
    this.logoContainer = new BaseElement('div', ['logo']);
    this.logoContainer.element.innerHTML = '';
    this.footerContainer.element.appendChild(this.footerHeading.element);
    this.footerContainer.element.appendChild(this.logoContainer.element);
    this.footerContainer.element.appendChild(this.linksContainer.element);
    this.element.appendChild(this.footerContainer.element);
  }

  render() {
    return this.element;
  }
}
