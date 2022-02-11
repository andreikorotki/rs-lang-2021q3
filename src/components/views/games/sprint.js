import { BaseView } from '..';
import { BaseElement } from '../../common';
import { getWordsData, getLevelGameButtons, gameTimer, playWord, setResetActiveLink } from '../../utils';
import { store } from '../../store';
import failed from '../../../../assets/sounds/wrong.mp3';
import success from '../../../../assets/sounds/correct.mp3';

export default class Sprint extends BaseView {
  constructor() {
    const contentElement = new BaseElement('section', ['sprint']);
    super(contentElement.element);
    this.wrapper = new BaseElement('div', ['wrapper']);
    this.buttonsGroupContainer = new BaseElement('div', ['buttons-group_container']);
    contentElement.element.append(this.wrapper.element);
    this.state = {
      isStartGameFromMenu: store.getState().toolkit.isStartGameFromMenu,
      countTime: 20,
      answers: null,
      question: 1,
      result: 0,
      indexEnglishWord: null,
      indexRussianWord: null,
      wrongAnswers: [],
      successAnswers: []
    };
  }

  run() {
    setResetActiveLink('.games-link');
    this.render();
    if (this.state.isStartGameFromMenu) {
      getLevelGameButtons(this.getGameData, this.buttonsGroupContainer.element);
    } else {
      this.startGame();
    }
  }

  render() {
    const gameContent = `
            <h2 class="game-title">
              Спринт
            </h2>
            <h3 class="game-text_level">
              Выберите уровень сложности:
            </h3>
          `;
    const html = `
      <div class="game-container">
        <a href="/#/games">
          <div class="close">X</div>
        </a>
        <div class="game-content">
          ${this.state.isStartGameFromMenu ? gameContent : ''}
        </div>
      </div>
    `;
    this.wrapper.element.insertAdjacentHTML('beforeend', html);
    const gameContainer = document.querySelector('.game-container');
    gameContainer.append(this.buttonsGroupContainer.element);
  }

  getGameData = async ({ target: { id } }) => {
    const group = Number(id);
    const page = Math.floor(Math.random() * 30) + 1;
    await getWordsData(group, page);
    this.startGame();
  };

  startGame() {
    const { words } = store.getState().toolkit;
    const answers = words.map((_, index) => this.getAnswers(index));
    this.state.answers = answers;
    this.renderGame(answers);
  }

  renderGame = () => {
    this.buttonsGroupContainer.element.remove();
    this.gameContent = document.querySelector('.game-content');
    this.loader = new BaseElement('div', ['loader']);
    this.gameContent.append(this.loader.element);
    this.gameContent.innerHTML = '';
    this.renderGameBoard();
    this.handleClick();
    gameTimer(this.state.countTime, this.endGame);
  };

  getAnswers = (answerIndex) => {
    const answers = [];
    const isTrueAnswer = Math.floor(Math.random() * 2) === 1;
    if (isTrueAnswer) {
      answers.push(answerIndex);
      answers.push(answerIndex);
    } else {
      const answer = Math.floor(Math.random() * 20);
      answers.push(answerIndex);
      answers.push(answer);
    }
    return answers;
  };

  renderGameBoard = () => {
    const html = `
      <div class="game-board">
        <div class="table timer">${this.state.countTime}</div>
        <div class="table result">${this.state.result}</div>
        <div class="answers-container_trues">
          <div class="answer-led" id="1"></div>
          <div class="answer-led" id="2"></div>
          <div class="answer-led" id="3"></div>
        </div>
        <div class="answer-content">
        </div>
        <div class="buttons-container_answers" id="answers">
          <button class="button-answer false" id="0">Не верно</button>
          <button class="button-answer true" id="1">Верно</button>
        </div>
      </div>
`;
    this.gameContent.insertAdjacentHTML('beforeend', html);
    this.getQuestion();
  };

  getQuestion = () => {
    const answerContent = document.querySelector('.answer-content');
    answerContent.innerHTML = '';
    if (this.state.question === 21) {
      this.endGame();
    } else {
      const html = this.renderQuestion();
      answerContent.insertAdjacentHTML('afterbegin', html);
      this.audioClick();
    }
  };

  renderQuestion() {
    const { words } = store.getState().toolkit;
    const [indexEnglishWord, indexRussianWord] = this.state.answers[this.state.question - 1];
    this.state.indexEnglishWord = indexEnglishWord;
    this.state.indexRussianWord = indexRussianWord;
    const { word, id } = words[indexEnglishWord];
    const { wordTranslate } = words[indexRussianWord];
    return `
      <button class="button audio-button" id="${id}" title="Прослушать..."></button>
      <div class="word-english">
        <p class="word-big">${word}</p>
      </div>
      <div class="word-russian">
        <p class="word-small">${wordTranslate}</p>
      </div>
  `;
  }

  audioClick = () => {
    const audioButtons = document.querySelectorAll('.audio-button');
    audioButtons.forEach((audioButton) => audioButton.addEventListener('click', (event) => playWord(event)));
  };

  handleClick() {
    const buttonsAnswers = document.getElementById('answers');
    buttonsAnswers.addEventListener('click', (event) => {
      this.handleEvents(event);
    });
  }

  handleEvents = ({ target: { id } }) => {
    const parseId = Boolean(Number(id));
    this.getResult(parseId);
  };

  getResult(result) {
    switch (result) {
      case true:
        if (this.state.indexEnglishWord === this.state.indexRussianWord) {
          this.setNewResult();
        }
        if (this.state.indexEnglishWord !== this.state.indexRussianWord) {
          this.setWrongResult();
        }
        break;
      case false:
        if (this.state.indexEnglishWord !== this.state.indexRussianWord) {
          this.setNewResult();
        }
        if (this.state.indexEnglishWord === this.state.indexRussianWord) {
          this.setWrongResult();
        }
        break;
      default:
    }
    this.state.question += 1;
    this.getQuestion();
  }

  setNewResult() {
    new Audio(success).play();
    this.result = document.querySelector('.result');
    this.state.result += 10;
    this.state.successAnswers.push(this.state.indexEnglishWord);
    this.result.textContent = this.state.result;
  }

  setWrongResult() {
    new Audio(failed).play();
    this.state.wrongAnswers.push(this.state.indexEnglishWord);
  }

  endGame = () => {
    this.renderFinalResult();
  };

  renderFinalResult() {
    this.gameBoard = document.querySelector('.game-board');
    this.gameBoard.style.justifyContent = 'initial';
    this.gameBoard.innerHTML = '';
    const html = `
      <h2 class="result-game_title">Игра окончена!</h2>
      <div class="result-content">
        <h3 class="result-title success">Верно:</h3>
        <ul class="result-table_success" id="success">
          ${this.getResultTable(this.state.successAnswers)}
        </ul>
        <h3 class="result-title wrong">Не верно:</h3>
        <ul class="result-table_wrong" id="wrong">
          ${this.getResultTable(this.state.wrongAnswers)}
        </ul>
      </div>
    `;
    this.gameBoard.insertAdjacentHTML('afterbegin', html);
    this.audioClick();
  }

  getResultTable = (data) => {
    let html = '';
    data.forEach((wordIndex) => {
      html += this.getItemResultTable(wordIndex);
    });
    return html;
  };

  getItemResultTable = (wordIndex) => {
    const { id, word, wordTranslate, transcription } = store.getState().toolkit.words[wordIndex];
    const html = `
      <li class="result-item">
        <button class="button audio-button" id="${id}" title="Прослушать..."></button>
        <span class="word-english_result">${word}</span>
        <span class="word-transcription">${transcription}</span>
        <span class="word-russian_result">${wordTranslate}</span>
      </li>
    `;
    return html;
  };
}
