import { BaseView } from '.';
import { BaseElement } from '../common';

export default class Games extends BaseView {
  constructor() {
    const contentElement = document.createElement('section');
    contentElement.classList.add('games');
    super(contentElement);
    this.wrapper = new BaseElement('div', ['wrapper']);
    contentElement.append(this.wrapper.element);
  }

  run() {
    this.render();
    this.handleClick();
  }

  render() {
    const html = `
    <div class="games-container">
      <div>
        <a class="link" href="/#/audiocall" id="audiocall">
          <div class="game-audiocall game">
          </div>
        </a>
        <p class="game-title">Аудиовызов</p>
      </div>
      <div>
        <a class="link" href="/#/sprint" id="sprint">
          <div class="game-sprint game">
          </div>
        </a>
        <p class="game-title">Спринт</p>
      </div>
    </div>
  `;
    this.wrapper.element.insertAdjacentHTML('beforeend', html);
  }

  handleClick() {
    const gamesContainer = document.querySelector('.games-container');
    gamesContainer.addEventListener('click', (event) => this.handleEvents(event));
  }

  handleEvents = (event) => {
    const { target } = event;
    console.log(target);
  };
}
