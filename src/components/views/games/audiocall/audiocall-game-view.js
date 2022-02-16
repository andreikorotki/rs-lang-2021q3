import { playAnswerSVG, playMainWordSVG, arrowSVG, rightWordSVG } from './svg';
import { AudioCallGameController } from '../../../controllers/audiocall-controller';
import { serverUrl } from '../../../services/settings';
import BaseElement from '../../../common/base-element';
import Button from '../../../common/button';
import BaseView from '../../base-view';
import failed from '../../../../../assets/sounds/wrong.mp3';
import success from '../../../../../assets/sounds/correct.mp3';
import { settings } from '../../../templates';

export default class AudioCallGameView extends BaseView {
  constructor(words) {
    const roundContainer = new BaseElement('section', ['audiocall-round__section']);
    super(roundContainer.element);
    const wrapper = new BaseElement('div', ['audiocall__wrapper']);
    this.content.innerHTML = settings;
    this.content.appendChild(wrapper.element);
    this.wrapper = this.content.lastChild;
    this.controller = new AudioCallGameController(words);
    this.currentRound = 1;
    this.roundAnswered = false;
    this.totalRounds = this.controller.calculateRoundsCount();
    this.addKeyboardListeners();
  }

  settingsClick = () => {
    this.settings = document.querySelector('.settings');
    this.volume = document.querySelector('.button-volume');
    this.volume.style.display = 'none';
    this.settings.addEventListener('click', this.setSettings);
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

  renderVariantsContainer() {
    const roundWords = this.controller.getRoundWords();
    const variantsContainer = new BaseElement('div', ['word-variants-container']);
    roundWords.forEach((variant, index) => {
      const shownNumber = index + 1;
      const variantItem = new BaseElement('div', ['variant__item'], '', `word-variant-${shownNumber}`);
      const variantNum = new BaseElement('span', ['variant-num'], `${shownNumber}`, `variant-num-${shownNumber}`);
      const variantTranslation = new BaseElement(
        'span',
        ['variant-translation'],
        `${variant.wordTranslate}`,
        `variant-translation-${shownNumber}`
      );
      variantItem.element.appendChild(variantNum.element);
      variantItem.element.appendChild(variantTranslation.element);
      variantsContainer.element.appendChild(variantItem.element);
      variantItem.element.addEventListener('click', () => this.onAnswer(shownNumber), { once: true });
    });
    return variantsContainer.element;
  }

  async renderRound() {
    this.roundAnswered = false;
    this.settingsClick();
    this.wrapper.innerHTML = '';
    this.controller.prepareRound();

    const mainWordContainer = new BaseElement('div', ['main-word-container']);
    const playMainContainer = new BaseElement('div', ['play-main-word-container']);
    const playMainBtn = new Button(
      ['btn', 'play-main-word__btn'],
      '',
      'button',
      'play-main-word-btn',
      async (event) => {
        event.preventDefault();
        await this.controller.playMainWord();
      }
    );
    const variantsContainerElement = this.renderVariantsContainer();

    const proceedContainer = new BaseElement('div', ['proceed-container']);
    const answerBtn = new Button(['btn', 'answer__btn'], 'не знаю', 'button', 'answer-btn', async (event) => {
      event.preventDefault();
      this.onAnswer();
    });

    playMainBtn.element.innerHTML = playMainWordSVG;
    proceedContainer.element.appendChild(answerBtn.element);
    playMainContainer.element.appendChild(playMainBtn.element);
    mainWordContainer.element.appendChild(playMainContainer.element);
    this.wrapper.appendChild(mainWordContainer.element);
    this.wrapper.appendChild(variantsContainerElement);
    this.wrapper.appendChild(proceedContainer.element);
    await this.controller.playMainWord();
  }

  rebuildMainWordContainer() {
    const mainWordContainer = document.querySelector('.main-word-container');
    mainWordContainer.innerHTML = '';
    const mainWord = this.controller.getMainWord();

    const mainWordImgContainer = new BaseElement('div', ['main-word-img-container']);
    mainWordImgContainer.element.style.backgroundImage = `url('${serverUrl}/${mainWord.image}')`;
    const mainWordInfo = new BaseElement('div', ['main-word-info']);
    const answerWord = new BaseElement('span', ['answer-word']);
    answerWord.element.innerText = mainWord.word;

    const playMainBtn = new Button(['btn', 'play-answer__btn'], '', 'button', 'play-answer-btn', async (event) => {
      event.preventDefault();
      await this.controller.playMainWord();
    });
    playMainBtn.element.innerHTML = playAnswerSVG;

    mainWordInfo.element.appendChild(playMainBtn.element);
    mainWordInfo.element.appendChild(answerWord.element);
    mainWordContainer.appendChild(mainWordImgContainer.element);
    mainWordContainer.appendChild(mainWordInfo.element);
  }

  rebuildProceedContainer() {
    const proceedContainer = document.querySelector('.proceed-container');
    proceedContainer.innerHTML = '';
    const answerBtn = new Button(['btn', 'answer__btn'], '', 'button', 'answer-btn', async (event) => {
      event.preventDefault();
      this.nextRound();
    });
    answerBtn.element.innerHTML = arrowSVG;
    proceedContainer.appendChild(answerBtn.element);
  }

  completeRound(correctNum, answerNum) {
    this.rebuildMainWordContainer();
    this.rebuildProceedContainer();

    const isSuccessRound = correctNum.toString() === answerNum.toString();
    const correctItem = document.getElementById(`word-variant-${correctNum}`);
    correctItem.classList.add('bold');
    if (isSuccessRound) {
      correctItem.classList.add('correct');
      const correctNumSpan = document.getElementById(`variant-num-${correctNum}`);
      correctNumSpan.innerText = '';
      correctNumSpan.innerHTML = rightWordSVG;
      this.controller.correctlyAnsweredWords.push(this.controller.mainWord);
      new Audio(success).play();
    } else {
      if (answerNum !== '-1') {
        const incorrectAnswer = document.getElementById(`word-variant-${answerNum}`);
        incorrectAnswer.classList.add('incorrect');
      }
      this.controller.incorrectlyAnsweredWords.push(this.controller.mainWord);
      new Audio(failed).play();
    }
    this.controller.onAttempt(isSuccessRound);
  }

  async nextRound() {
    this.currentRound++;
    if (this.currentRound <= this.totalRounds) {
      this.renderRound();
    } else {
      await this.controller.addGameToUserStats();
      this.renderStats();
    }
  }

  onAnswer(guessNum = '-1') {
    if (!this.roundAnswered) {
      this.roundAnswered = true;
      const correctIndex = this.controller.getCorrectNum();
      this.completeRound(correctIndex, guessNum);
    }
  }

  static createWordItem(word) {
    const wordContainer = new BaseElement('div', ['word-item-container']);
    const playWordBtn = new Button(['btn', 'play-answer__btn'], '', 'button', '', async (event) => {
      event.preventDefault();
      await new Audio(`${serverUrl}/${word.audio}`).play();
    });
    const wordInfo = new BaseElement('div', ['word-item-info']);
    const wordName = new BaseElement('span', ['word-item-word'], `${word.word}`);
    const wordTranslation = new BaseElement('span', ['word-translation'], `${word.wordTranslate}`);
    const dash = new BaseElement('span', ['dash'], ' - ');

    playWordBtn.element.innerHTML = playAnswerSVG;
    wordContainer.element.appendChild(playWordBtn.element);
    wordInfo.element.appendChild(wordName.element);
    wordInfo.element.appendChild(dash.element);
    wordInfo.element.appendChild(wordTranslation.element);
    wordContainer.element.appendChild(wordInfo.element);
    return wordContainer.element;
  }

  renderCorrectStats(gameResult) {
    if (this.controller.correctlyAnsweredWords.length > 0) {
      const correctList = new BaseElement('div', ['word-list']);
      const correctHeading = new BaseElement('h3', ['word-list-heading-correct'], 'Верные ответы:');
      correctList.element.appendChild(correctHeading.element);
      this.controller.correctlyAnsweredWords.forEach((word) => {
        const wordItem = AudioCallGameView.createWordItem(word);
        correctList.element.appendChild(wordItem);
      });
      gameResult.element.appendChild(correctList.element);
    }
  }

  renderIncorrectStats(gameResult) {
    if (this.controller.incorrectlyAnsweredWords.length > 0) {
      const incorrectHeading = new BaseElement('h3', ['word-list-heading-incorrect'], 'Ошибки:');
      const incorrectList = new BaseElement('div', ['word-list']);
      incorrectList.element.appendChild(incorrectHeading.element);
      this.controller.incorrectlyAnsweredWords.forEach((word) => {
        const wordItem = AudioCallGameView.createWordItem(word);
        incorrectList.element.appendChild(wordItem);
      });
      gameResult.element.appendChild(incorrectList.element);
    }
  }

  renderStats() {
    this.wrapper.innerHTML = '';
    const gameResult = new BaseElement('div', ['game-result']);
    const gameResultHeading = new BaseElement('h2', ['game-result-heading'], 'Игра окончена!');
    gameResult.element.appendChild(gameResultHeading.element);
    this.renderCorrectStats(gameResult);
    this.renderIncorrectStats(gameResult);
    this.wrapper.appendChild(gameResult.element);
  }

  addKeyboardListeners() {
    const roundSection = document.querySelector('.audiocall-round__section');
    roundSection.tabIndex = 0;
    roundSection.focus();
    roundSection.addEventListener('keydown', (event) => {
      const variantKeys = ['1', '2', '3', '4', '5'];
      if (variantKeys.includes(event.key)) {
        this.onAnswer(event.key);
      }
      if (event.code === 'Space') {
        this.controller.playMainWord();
      }
      if (event.code === 'Enter' && !this.roundAnswered) {
        this.onAnswer();
      } else if (event.code === 'Enter' && this.roundAnswered) {
        this.nextRound();
      }
    });
  }
}
