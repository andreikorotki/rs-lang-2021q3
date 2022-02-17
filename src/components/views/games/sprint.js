import moment from 'moment';
import { BaseView } from '..';
import { BaseElement } from '../../common';
import {
  getWordsData,
  getLevelGameButtons,
  gameTimer,
  playAudio,
  setResetActiveLink,
  getAudioUrl,
  getResultTable,
  getGameBoard
} from '../../utils';
import { store } from '../../store';
import failed from '../../../../assets/sounds/wrong.mp3';
import success from '../../../../assets/sounds/correct.mp3';
import { settings, gameContent } from '../../templates';
import { setUserWords } from '../../store/toolkitReducer';
import { pagesInGroupCount, wordsPerPageCount } from '../../services/settings';
import { updateGameStatistic } from '../../controllers/statistics-controller';
import { createUserWord, getUserWord, updateUserWord } from '../../api/users';
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
      isLogin: store.getState().toolkit.isLogin,
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
      correctAnswers: [],
      wrongAnswersSeries: 0,
      correctAnswersSeries: 0,
      longestSeries: 0,
      lastQuestion: wordsPerPageCount,
      newWords: 0,
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
    const { group, page } = this.state;
    await getWordsData(group, page);
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
    const html = getGameBoard(this.state);
    this.gameContent.insertAdjacentHTML('beforeend', html);
    this.getQuestion();
  };

  getQuestion = () => {
    const answerContent = document.querySelector('.answer-content');
    if (answerContent) {
      answerContent.innerHTML = '';
    }
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
    const close = document.querySelector('.close');
    close.addEventListener('click', this.closeGame);
    document.addEventListener('keydown', this.keyboardEvents);
  }

  closeGame = () => {
    document.removeEventListener('keydown', this.keyboardEvents);
  };

  keyboardEvents = (event) => {
    const audioButtons = document.querySelectorAll('.audio-button');
    const [{ id }] = audioButtons;
    const url = getAudioUrl(id);
    const { code } = event;
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
    event.preventDefault();
  };

  handleEvents = ({ target: { id } }) => {
    const parseId = Boolean(Number(id));
    this.getResult(parseId);
  };

  getResult(result) {
    switch (result) {
      case true:
        if (this.state.indexEnglishWord === this.state.indexRussianWord) {
          this.setCorrectResult();
        }
        if (this.state.indexEnglishWord !== this.state.indexRussianWord) {
          this.setWrongResult();
        }
        break;
      case false:
        if (this.state.indexEnglishWord !== this.state.indexRussianWord) {
          this.setCorrectResult();
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

  setCorrectResult() {
    if (this.state.isLogin) {
      this.updateUserWordData(true);
    }
    if (this.state.isAudio) {
      playAudio(success);
    }
    this.state.correctAnswersSeries += 1;
    this.state.wrongAnswersSeries = 0;
    const { correctAnswersSeries } = this.state;
    switch (true) {
      case correctAnswersSeries > 5:
        this.state.prize = 30;
        break;
      case correctAnswersSeries > 2:
        this.state.prize = 20;
        break;
      default:
        this.state.prize = 10;
    }
    const { prize, level, indexEnglishWord, result } = this.state;
    this.result = document.querySelector('.result');
    this.state.result += prize * level;
    this.state.correctAnswers.push(indexEnglishWord);
    this.result.textContent = result;
  }

  updateUserWordData = async (result) => {
    const words = this.state.wordsForGame[this.state.question - 1];
    const attempts = words.optional.attempts + Number(result);
    console.log(attempts);
    const { id, difficulty } = words;
    const optional = { ...words.optional, attempts };
    const userWordProperty = { difficulty, optional };
    const { userId } = getState();
    const isUserWordCreated = (await getUserWord({ userId, wordId: id })).success;
    if (isUserWordCreated) {
      updateUserWord(userId, id, userWordProperty);
    } else {
      createUserWord(userId, id, userWordProperty);
      this.state.newWords += 1;
    }
  };

  setWrongResult() {
    if (this.state.isLogin) {
      this.updateUserWordData(false);
    }
    if (this.state.isAudio) {
      playAudio(failed);
    }
    const { longestSeries, correctAnswersSeries } = this.state;
    this.state.longestSeries = longestSeries < correctAnswersSeries ? correctAnswersSeries : longestSeries;
    this.state.correctAnswersSeries = 0;
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
    const { result, correctAnswers, wrongAnswers, isLogin } = this.state;
    const html = `
      <h2 class="result-game_title">Игра окончена!</h2>
      <h3 class="result-game_points">Вы набрали ${result} очков</h3>
      <div class="result-content">
        <h3 class="result-title success">Верно:</h3>
        <ul class="result-table_success" id="success">
          ${getResultTable(correctAnswers)}
        </ul>
        <h3 class="result-title wrong">Не верно:</h3>
        <ul class="result-table_wrong" id="wrong">
          ${getResultTable(wrongAnswers)}
        </ul>
      </div>
    `;
    this.gameBoard.insertAdjacentHTML('afterbegin', html);
    this.audioClick();
    if (isLogin) {
      this.setUserStatistics();
    }
  }

  setUserStatistics = async () => {
    const dateKey = moment(new Date()).format('DD_MM_YYYY');
    const { correctAnswers, wrongAnswers, longestSeries, newWords } = this.state;
    console.log(this.state);
    const gameStat = {
      wrongAnswers: wrongAnswers.length,
      correctAnswers: correctAnswers.length,
      dateKey,
      game: 'sprint',
      learnedWords: 0,
      newWords,
      longestSeries
    };
    console.log(gameStat);
    updateGameStatistic(gameStat);
  };
}
