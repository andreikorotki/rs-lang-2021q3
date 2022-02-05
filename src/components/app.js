import { Header } from './views/header/header';
import { Footer } from './views/footer/footer';

export class App {
  render() {
    const rootContainer = document.createElement('div');
    rootContainer.classList.add('root');
    this.header = new Header();
    this.footer = new Footer();
    document.body.append(this.header.render());
    document.body.appendChild(rootContainer);
  }
}
