// import { Footer } from './footer/footer';
// import { Header } from './header/header';

export default class BaseView {
  content;

  header;

  footer;

  element;

  constructor(contentElement) {
    const container = document.querySelector('.root');
    container.innerHTML = ''; // reset content
    // this.header = new Header();
    this.content = contentElement;
    // this.footer = new Footer();
    // container.append(this.header.render());
    container.append(this.content);
    // container.append(this.footer.render());
    this.element = container;
  }

  render() {
    return this.element;
  }
}
