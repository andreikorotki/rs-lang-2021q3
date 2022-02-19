import { Header } from './views/header/header';
import { Footer } from './views/footer/footer';
import { Burger } from './views/header/burger';
import { setResetActiveLink, hiddenFooter } from './utils';

export class App {
  render() {
    const rootContainer = document.createElement('div');
    rootContainer.classList.add('root');
    this.header = new Header();
    this.burger = new Burger();
    this.footer = new Footer();
    document.body.append(this.header.render());
    document.body.append(this.burger.render());
    document.body.append(rootContainer);
    document.body.append(this.footer.render());
    this.setStartActiveLink();
  }

  setStartActiveLink = () => {
    const currentPageHash = window.location.hash;
    setResetActiveLink(`.${currentPageHash.slice(2)}-link`);
    hiddenFooter(currentPageHash);
  };
}
