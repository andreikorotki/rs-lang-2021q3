import { Header } from '../views/header/header';

export function renderHeader() {
  let header = document.querySelector('.header');
  header.remove();
  const { body } = document;
  header = new Header();
  body.prepend(header.render());
}
