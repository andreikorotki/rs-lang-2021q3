import { BaseView } from '..';
import { BaseElement, Button } from '../../common';

export default class Sprint extends BaseView {
  constructor() {
    const contentElement = document.createElement('section');
    contentElement.classList.add('sprint');
    super(contentElement);
    this.wrapper = new BaseElement('div', ['wrapper']);
    this.buttonsGroupContainer = new BaseElement('div', ['buttons-group_container']);
    contentElement.append(this.wrapper.element);
    this.state = {
      level: 1
    };
  }

  run() {
    this.render();
    this.getLevelGameButtons();
  }

  render() {
    const html = `
      <div class="game-container">
        <a href="/#/games">
          <div class="close">X</div>
        </a>
        <h2 class="game-title">
          Спринт
        </h2>
        <h3 class="game-text_level">
          Выберите уровень сложности:
        </h3>
      </div>
    `;
    this.wrapper.element.insertAdjacentHTML('beforeend', html);
    const gameContainer = document.querySelector('.game-container');
    gameContainer.append(this.buttonsGroupContainer.element);
  }

  getLevelGameButtons() {
    const buttonsGroup = 6;
    [...Array(buttonsGroup).keys()].forEach((button) => {
      this.button = new Button(
        ['button-group', `button-group_color-${button + 1}`],
        `${button + 1}`,
        'button',
        `${button + 1}`,
        this.getLevelGame
      );
      this.buttonsGroupContainer.element.append(this.button.element);
    });
  }

  getLevelGame() {
    this.state.level = this.id;
  }

  handleClick() {
    return this;
  }
}
