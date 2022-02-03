import BaseElement from './common/base-element';
import { Footer } from './views/footer/footer';
import { Header } from './views/header/header';

export class App {
  render() {
    const rootContainer = new BaseElement('div', ['root']);
    const header = new Header();
    const footer = new Footer();
    document.body.appendChild(header.render());
    document.body.appendChild(rootContainer.element);
    document.body.appendChild(footer.render());
  }
}
