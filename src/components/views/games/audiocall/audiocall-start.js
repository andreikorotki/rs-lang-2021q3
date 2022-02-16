import { GameStartView } from './game-start';
import BaseElement from '../../../common/base-element';
import { getLevelGameButtons } from '../../../controllers/audiocall-controller';

export class AudioCallStartView extends GameStartView {
  constructor() {
    super('audiocall', 'Аудиовызов');
    this.buttonsGroupContainer = new BaseElement('div', ['buttons-group_container']);
  }

  settingsClick = () => {
    this.settings = document.querySelector('.settings');
    this.volume = document.querySelector('.button-volume');
    this.volume.style.display = 'none';
  };

  setSettings = ({ target }) => {
    if (target.classList.contains('button-volume')) {
      target.classList.toggle('mute');
      this.state.isAudio = !this.state.isAudio;
    }
    if (target.classList.contains('button-full-screen')) {
      document.documentElement.requestFullscreen().catch();
    }
  };

  setDescription() {
    const gameWrapper = document.querySelector(`.${this.name}-wrapper`);
    const gameDescription = new BaseElement('div', ['game__description']);
    gameDescription.element.innerText = '«Аудиовызов» - это тренировка, которая улучшает восприятие речи на слух.';
    const gameRules = new BaseElement('div', ['game-rules__container']);
    gameRules.element.innerHTML = `<ul class="game-rules">
                                      <li class="game-rule__item">Выберете уровень для начала игры</li>
                                      <li class="game-rule__item">Используйте мышь, чтобы выбрать вариант ответа</li>
                                      <li class="game-rule__item">Используйте цифровые клавиши от 1 до 5 для выбора ответа</li>
                                      <li class="game-rule__item">Используйте пробел для повтроного звучания слова</li>
                                      <li class="game-rule__item">Используйте клавишу Enter для перехода к следующему набору слов</li>
                                    </ul>`;
    gameWrapper.appendChild(gameDescription.element);
    gameWrapper.appendChild(gameRules.element);
    getLevelGameButtons(this.buttonsGroupContainer.element);
    gameWrapper.appendChild(this.buttonsGroupContainer.element);
  }

  render() {
    this.setDescription();
    this.settingsClick();
    return this.element;
  }
}
