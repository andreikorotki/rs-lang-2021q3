import moment from 'moment';
import { BaseView } from '..';
import { BaseElement } from '../../common';
import { getWordsData, getLevelGameButtons, gameTimer, playAudio, setResetActiveLink, getAudioUrl } from '../../utils';
import { store } from '../../store';
import failed from '../../../../assets/sounds/wrong.mp3';
import success from '../../../../assets/sounds/correct.mp3';
import { settings } from '../../templates';
import { setUserWords } from '../../store/toolkitReducer';
import { pagesInGroupCount, wordsPerPageCount } from '../../services/settings';
import { setUserStatistics } from '../../api/users';
import { getState } from '../../services';

export default class Sprint extends BaseView {
  constructor() {
    const contentElement = new BaseElement('section', ['sprint']);
    super(contentElement.element);
    this.wrapper = new BaseElement('div', ['wrapper']);
    this.buttonsGroupContainer = new BaseElement('div', ['buttons-group_container']);
    contentElement.element.append(this.wrapper.element);
    this.state = {
      isStartGameFromMenu: store.getState().toolkit.isStartGameFromMenu,
      group: store.getState().toolkit.group,
      page: store.getState().toolkit.page,
      wordsForGame: [],
      countTime: 30,
      answers: null,
      question: 1,
      result: 0,
      prize: 10,
      level: 1,
      indexEnglishWord: null,
      indexRussianWord: null,
      wrongAnswers: [],
      successAnswers: [],
      wrongAnswersSeries: 0,
      successAnswersSeries: 0,
      lastQuestion: wordsPerPageCount,
      isAudio: true
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
      <p class="game-title_description">
        "Спринт" - в этой игре Вам за определённое время необходимо угадать как можно больше слов.
      </p>
      <div class="game-options_container">
         <p class="game-options">
          Выберите уровень для начала игры
        </p>
        <p class="game-options">
          Используйте мышь, чтобы выбрать вариант ответа
        </p>
        <p class="game-options">
          Используйте стрелки влево или вправо для выбора ответа
        </p>
        <p class="game-options">
          Используйте пробел для озвучивания текущего слова
        </p>
      </div>
    `;
    const html = `
      <div class="game-container sprint">
        ${settings}
        <div class="game-content">
          ${this.state.isStartGameFromMenu ? gameContent : ''}
        </div>
      </div>
    `;
    this.wrapper.element.insertAdjacentHTML('beforeend', html);
    const gameContainer = document.querySelector('.game-container');
    gameContainer.append(this.buttonsGroupContainer.element);
    this.settingsClick();
  }

  getGameData = async ({ target: { id } }) => {
    const group = Number(id);
    this.state.level = group;
    const page = Math.floor(Math.random() * pagesInGroupCount) + 1;
    await getWordsData(group, page);
    this.setUsersWords();
    this.startGame();
  };

  setUsersWords = () => {
    const { userWords } = store.getState().toolkit;
    const { words } = store.getState().toolkit;
    const newWords = Array.from(new Set([...userWords, ...words].map(JSON.stringify))).map(JSON.parse);
    store.dispatch(setUserWords(newWords));
  };

  async startGame() {
    const { words } = store.getState().toolkit;
    const noLearnedWords = words.filter((word) => word.optional.isLearned !== true);
    let wordsForGame = this.state.isStartGameFromMenu ? words : noLearnedWords;
    this.state.wordsForGame = wordsForGame;
    if (wordsForGame.length < wordsPerPageCount) {
      wordsForGame = await this.addWordsForGame(wordsForGame);
    }
    const answers = this.state.wordsForGame.map((_, index) => this.getAnswers(index));
    this.state.answers = answers;
    this.renderGame(answers);
  }

  addWordsForGame = async (wordsForGame) => {
    const { group, page } = this.state;
    if (wordsForGame.length !== wordsPerPageCount) {
      if (page !== 1) {
        this.state.page -= 1;
        await getWordsData(group, this.state.page);
        const { words } = store.getState().toolkit;
        const noLearnedWords = words.filter((word) => word.optional.isLearned === false);
        noLearnedWords.forEach((noLearnedWord) => {
          if (this.state.wordsForGame.length < wordsPerPageCount) {
            this.state.wordsForGame.push(noLearnedWord);
          }
        });
        this.addWordsForGame(this.state.wordsForGame);
      } else {
        this.state.wordsForGame = wordsForGame;
      }
    }
    this.state.wordsForGame = wordsForGame;
  };

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
    const answersCount = this.state.wordsForGame.length;
    this.state.lastQuestion = answersCount;
    const answers = [];
    const isTruePressedButton = Math.floor(Math.random() * 2) === 1;
    const answer = Math.floor(Math.random() * answersCount);
    if (isTruePressedButton) {
      answers.push(answerIndex);
      answers.push(answerIndex);
    } else {
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
          <div class="answer-led on" id="1"></div>
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
    if (this.state.question > this.state.lastQuestion) {
      this.endGame();
    } else {
      const html = this.renderQuestion();
      answerContent.insertAdjacentHTML('afterbegin', html);
      this.audioClick();
    }
  };

  renderQuestion() {
    const { wordsForGame } = this.state;
    const [indexEnglishWord, indexRussianWord] = this.state.answers[this.state.question - 1];
    this.state.indexEnglishWord = indexEnglishWord;
    this.state.indexRussianWord = indexRussianWord;
    const { word, id } = wordsForGame[indexEnglishWord];
    const { wordTranslate } = wordsForGame[indexRussianWord];
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

  settingsClick = () => {
    this.settings = document.querySelector('.settings');
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

  audioClick = () => {
    const audioButtons = document.querySelectorAll('.audio-button');
    audioButtons.forEach((audioButton) =>
      audioButton.addEventListener('click', (event) => {
        if (this.state.isAudio) {
          const wordId = event.target.id;
          const url = getAudioUrl(wordId);
          playAudio(url);
        }
      })
    );
  };

  handleClick() {
    const buttonsAnswers = document.getElementById('answers');
    buttonsAnswers.addEventListener('click', (event) => {
      this.handleEvents(event);
    });
    document.addEventListener('keydown', this.keyboardEvents);
  }

  keyboardEvents = ({ code }) => {
    const audioButtons = document.querySelectorAll('.audio-button');
    const [{ id }] = audioButtons;
    const url = getAudioUrl(id);
    switch (code) {
      case 'ArrowLeft':
        this.getResult(false);
        break;
      case 'ArrowRight':
        this.getResult(true);
        break;
      case 'Space':
        if (this.state.isAudio) {
          playAudio(url);
        }
        break;
      default:
    }
  };

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
    if (this.state.isAudio) {
      playAudio(success);
    }
    this.state.successAnswersSeries += 1;
    this.state.wrongAnswersSeries = 0;
    const { successAnswersSeries } = this.state;
    switch (true) {
      case successAnswersSeries > 5:
        this.state.prize = 30;
        break;
      case successAnswersSeries > 2:
        this.state.prize = 20;
        break;
      default:
        this.state.prize = 10;
    }
    this.result = document.querySelector('.result');
    this.state.result += this.state.prize * this.state.level;
    this.state.successAnswers.push(this.state.indexEnglishWord);
    this.result.textContent = this.state.result;
  }

  setWrongResult() {
    if (this.state.isAudio) {
      playAudio(failed);
    }
    this.state.successAnswersSeries -= 3;
    const isSuccessLessZero = this.state.successAnswersSeries < 0;
    this.state.successAnswersSeries = isSuccessLessZero ? 0 : this.state.successAnswersSeries;
    this.state.wrongAnswersSeries += 1;
    this.state.wrongAnswers.push(this.state.indexEnglishWord);
  }

  endGame = () => {
    this.renderFinalResult();
  };

  renderFinalResult() {
    this.gameBoard = document.querySelector('.game-board');
    this.gameBoard.style.justifyContent = 'initial';
    this.gameBoard.innerHTML = '';
    const { result, successAnswers, wrongAnswers } = this.state;
    const html = `
      <h2 class="result-game_title">Игра окончена!</h2>
      <h3 class="result-game_points">Вы набрали ${result} очков</h3>
      <div class="result-content">
        <h3 class="result-title success">Верно:</h3>
        <ul class="result-table_success" id="success">
          ${this.getResultTable(successAnswers)}
        </ul>
        <h3 class="result-title wrong">Не верно:</h3>
        <ul class="result-table_wrong" id="wrong">
          ${this.getResultTable(wrongAnswers)}
        </ul>
      </div>
    `;
    this.gameBoard.insertAdjacentHTML('afterbegin', html);
    this.audioClick();
    this.setUserStatistics();
  }

  setUserStatistics = () => {
    const { userId } = getState();
    const dateStats = moment(new Date()).format('DD_MM_YYYY');
    const gameStats = {
      learnedWords: 10,
      optional: {
        sprint: {
          [dateStats]: {
            wrongAnswers: 10,
            correctAnswers: 10,
            learnedWords: 10,
            newWords: 10,
            longestSeries: 10
          }
        }
      }
    };
    setUserStatistics(userId, gameStats);
  };

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
