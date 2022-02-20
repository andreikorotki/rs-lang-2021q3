import { Burger } from '../views/header/burger';
import { Header } from '../views/header/header';

export function renderHeader() {
  let header = document.querySelector('.header');
  let burger = document.querySelector('.burger');
  header.remove();
  burger.remove();
  const { body } = document;
  header = new Header();
  burger = new Burger();
  body.prepend(burger.render());
  body.prepend(header.render());
}
