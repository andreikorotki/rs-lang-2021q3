import { playAnswerSVG, playMainWordSVG, arrowSVG, rightWordSVG } from './svg';
import { AudioCallGameController } from '../../controllers/audiocall-controller';
import { serverUrl } from '../../services/settings';
import BaseElement from '../../common/base-element';
import Button from '../../common/button';
import BaseView from '../base-view';
import failed from '../../../../assets/sounds/wrong.mp3';
import success from '../../../../assets/sounds/correct.mp3';

export default class AudioCallGameView extends BaseView {
  constructor(words) {
    const roundContainer = new BaseElement('section', ['audiocall-round__section']);
    super(roundContainer.element);
    this.controller = new AudioCallGameController(words);
    this.currentRound = 1;
    this.roundAnswered = false;
    this.totalRounds = this.controller.calculateRoundsCount();
    this.addKeyboardListeners();
  }

  async renderRound() {
    this.roundAnswered = false;
    this.content.innerHTML = '';
    this.controller.prepareRound();
    const roundWords = this.controller.getRoundWords();
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
    playMainBtn.element.innerHTML = playMainWordSVG;

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

    const proceedContainer = new BaseElement('div', ['proceed-container']);
    const answerBtn = new Button(['btn', 'answer__btn'], 'не знаю', 'button', 'answer-btn', async (event) => {
      event.preventDefault();
      this.onAnswer();
    });
    proceedContainer.element.appendChild(answerBtn.element);
    playMainContainer.element.appendChild(playMainBtn.element);
    mainWordContainer.element.appendChild(playMainContainer.element);
    this.content.appendChild(mainWordContainer.element);
    this.content.appendChild(variantsContainer.element);
    this.content.appendChild(proceedContainer.element);
    await this.controller.playMainWord();
    return this;
  }

  completeRound(correctNum, answerNum) {
    const mainWordContainer = document.querySelector('.main-word-container');
    const proceedContainer = document.querySelector('.proceed-container');
    mainWordContainer.innerHTML = '';
    proceedContainer.innerHTML = '';
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
    const answerBtn = new Button(['btn', 'answer__btn'], '', 'button', 'answer-btn', async (event) => {
      event.preventDefault();
      this.nextRound();
    });
    answerBtn.element.innerHTML = arrowSVG;
    mainWordInfo.element.appendChild(playMainBtn.element);
    mainWordInfo.element.appendChild(answerWord.element);
    mainWordContainer.appendChild(mainWordImgContainer.element);
    mainWordContainer.appendChild(mainWordInfo.element);
    proceedContainer.appendChild(answerBtn.element);
    const isSuccessRound = correctNum.toString() === answerNum.toString();
    const correctItem = document.getElementById(`word-variant-${correctNum}`);
    correctItem.classList.add('bold');
    if (isSuccessRound) {
      correctItem.classList.add('correct');
      const correctNumSpan = document.getElementById(`variant-num-${correctNum}`);
      correctNumSpan.innerText = '';
      correctNumSpan.innerHTML = rightWordSVG;
      // TODO set learning progress attempt, remove from learned otherwise
      new Audio(success).play();
    } else {
      if (answerNum !== '-1') {
        const incorrectAnswer = document.getElementById(`word-variant-${answerNum}`);
        incorrectAnswer.classList.add('incorrect');
      }
      new Audio(failed).play();
    }
  }

  nextRound() {
    this.currentRound++;
    if (this.currentRound <= this.totalRounds) {
      this.renderRound();
    } else {
      // TODO render stats
      this.renderStarts();
    }
    return this;
  }

  onAnswer(guessNum = '-1') {
    if (!this.roundAnswered) {
      this.roundAnswered = true;
      const correctIndex = this.controller.getCorrectNum();
      this.completeRound(correctIndex, guessNum);
    }
    return this;
  }

  renderStarts() {
    this.content.innerText = 'Game Over!';
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
        this.onAnswer('-1');
      } else if (event.code === 'Enter' && this.roundAnswered) {
        this.nextRound();
      }
    });
  }
}
