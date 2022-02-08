import { GameStartView } from './game-start';
import BaseElement from '../../common/base-element';
import { getWordsForGame } from '../../controllers/audiocall-controller';
import AudioCallGameView from './audiocall-game-view';

export class AudioCallStartView extends GameStartView {
  constructor() {
    super('audiocall', 'Аудиовызов');
  }

  setDescription() {
    const gameWrapper = document.querySelector(`.${this.name}-wrapper`);
    const gameDescription = new BaseElement('div', ['game__description']);
    gameDescription.element.innerText = '«Аудиовызов» - это тренировка, которая улучшает восприятие речи на слух.';
    const gameRules = new BaseElement('div', ['game-rules__container']);
    gameRules.element.innerHTML = `<ul class="game-rules">
                                      <li class="game-rule__item">Используйте мышь, чтобы выбрать вариант ответа</li>
                                      <li class="game-rule__item">Используйте цифровые клавиши от 1 до 5 для выбора ответа</li>
                                      <li class="game-rule__item">Используйте пробел для повтроного звучания слова</li>
                                      <li class="game-rule__item">Используйте клавишу Enter для перехода к следующему набору слов</li>
                                    </ul>`;
    gameWrapper.appendChild(gameDescription.element);
    gameWrapper.appendChild(gameRules.element);
    return this.element;
  }

  render() {
    this.setDescription();
    this.buildForm();
    const audioCallBtn = document.getElementById(`${this.name}-start-btn`);

    audioCallBtn.addEventListener('click', async () => {
      const selectedGroup = document.getElementById(`${this.name}-select-group`).value;
      const words = await getWordsForGame(+selectedGroup);
      const game = new AudioCallGameView(words);
      game.renderRound();
    });
    return this.element;
  }
}
