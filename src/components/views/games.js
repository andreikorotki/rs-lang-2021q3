import { BaseView } from '.';
import { BaseElement } from '../common';
import { store } from '../store';
import { setGameStartFromMenu } from '../store/toolkitReducer';
import { gamesContainer } from '../templates';
import { hiddenFooter } from '../utils';

export default class Games extends BaseView {
  constructor() {
    const contentElement = new BaseElement('section', ['games']);
    super(contentElement.element);
    this.wrapper = new BaseElement('div', ['wrapper']);
    contentElement.element.append(this.wrapper.element);
  }

  run() {
    hiddenFooter();
    this.render();
    this.handleClicks();
  }

  render() {
    this.wrapper.element.insertAdjacentHTML('beforeend', gamesContainer);
  }

  handleClicks() {
    this.gameContainer = document.querySelector('.games-container');
    this.gameContainer.addEventListener('click', () => this.startGame());
  }

  startGame = () => {
    store.dispatch(setGameStartFromMenu(true));
  };
}
