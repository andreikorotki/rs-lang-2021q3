// import { Footer } from './footer/footer';
// import { Header } from './header/header';

export default class BaseView {
  element;

  constructor(contentElement) {
    const container = document.querySelector('.root');
    container.innerHTML = ''; // reset content
    this.element = container;
    this.element.appendChild(contentElement);
    this.content = this.element.firstChild;
  }

  render() {
    return this.element;
  }
}
