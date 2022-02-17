import { BaseView } from '.';
import { BaseElement } from '../common';
import { store } from '../store';
import { setGameStartFromMenu } from '../store/toolkitReducer';

export default class Games extends BaseView {
  constructor() {
    const contentElement = new BaseElement('section', ['games']);
    super(contentElement.element);
    this.wrapper = new BaseElement('div', ['wrapper']);
    contentElement.element.append(this.wrapper.element);
  }

  run() {
    this.render();
    this.handleClicks();
  }

  render() {
    const html = `
    <div class="games-container">
      <div>
        <a class="link" href="#/audiocall-start" id="audiocall">
          <div class="game-audiocall game">
          </div>
        </a>
        <p class="game-title">Аудиовызов</p>
      </div>
      <div>
        <a class="link" href="#/sprint" id="sprint">
          <div class="game-sprint game">
          </div>
        </a>
        <p class="game-title">Спринт</p>
      </div>
    </div>
  `;
    this.wrapper.element.insertAdjacentHTML('beforeend', html);
  }

  handleClicks() {
    this.gameContainer = document.querySelector('.games-container');
    this.gameContainer.addEventListener('click', () => this.startGame());
  }

  startGame = () => {
    store.dispatch(setGameStartFromMenu(true));
  };
}
