import { BaseView } from '..';
import { BaseElement, Button } from '../../common';
import { store } from '../../store';
import { getWordsData, shuffle } from '../../utils';
import { serverUrl } from '../../services/settings';

export default class Audiocall extends BaseView {
  constructor() {
    const contentElement = document.createElement('section');
    contentElement.classList.add('audiocall');
    super(contentElement);
    this.wrapper = new BaseElement('div', ['wrapper']);
    this.buttonsGroupContainer = new BaseElement('div', ['buttons-group_container']);
    contentElement.append(this.wrapper.element);
    this.state = {
      isStartFromMenu: store.getState().isStartFromMenu,
      answers: []
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
        <div class="game-content">
          <h2 class="game-title">
            Аудиовызов
          </h2>
          <h3 class="game-text_level">
            Выберите уровень сложности:
          </h3>
        </div>
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
        this.getGameData
      );
      this.buttonsGroupContainer.element.append(this.button.element);
    });
  }

  getGameData = async (event) => {
    const { target } = event;
    const { id } = target;
    const group = Number(id);
    const page = 1 + Math.floor(Math.random() * 30);
    await getWordsData(group, page);
    const { words } = store.getState().toolkit;
    words.forEach((_, index) => {
      this.getAnswers(index);
    });
    this.startGame();
  };

  startGame = () => {
    this.buttonsGroupContainer.element.remove();
    const gameContent = document.querySelector('.game-content');
    gameContent.innerHTML = '';
  };

  getAnswers = (answerIndex) => {
    const answers = new Set();
    answers.add(answerIndex);
    while (answers.size < 4) {
      const answer = Math.floor(Math.random() * 20);
      answers.add(answer);
    }
    const shuffledAnswers = shuffle(Array.from(answers));
    this.state.answers.push(shuffledAnswers);
  };

  getAudioPaths = (gameWords) => {
    const audioPaths = gameWords.map(({ audio }) => {
      return `${serverUrl}/${audio}`;
    });
    audioPaths.forEach((path) => {
      const audio = new Audio(path);
      audio.play();
    });
  };

  handleClick() {
    return this;
  }
}
