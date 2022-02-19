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
  getGameBoard,
  getWordsLearned,
  getAttemptsCount
} from '../../utils';
import { store } from '../../store';
import failed from '../../../../assets/sounds/wrong.mp3';
import success from '../../../../assets/sounds/correct.mp3';
import { settings, gameContent } from '../../templates';
import { setEndLearnedWords, setStartLearnedWords, setUserWords } from '../../store/toolkitReducer';
import { pagesInGroupCount, wordsPerPageCount } from '../../services/settings';
import { updateGameStatistic } from '../../controllers/statistics-controller';
import { createUserWord, getUserWord, getUserWords, updateUserWord } from '../../api/users';
import { getState } from '../../services';
import { DIFFICULTIES, SPRINT_STATE, SPRINT_LEVELS, PRIZE_POINTS, WORDS_LEARNED } from '../../constants';

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
      countTime: SPRINT_STATE.countTime,
      answers: null,
      question: 1,
      result: 0,
      prize: PRIZE_POINTS.ten,
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
      isAudio: true,
      isEndGame: false
    };
  }

  run() {
    setResetActiveLink('.games-link');
    this.render();
    const { isLogin, isStartGameFromMenu } = this.state;
    if (isStartGameFromMenu) {
      if (isLogin) {
        this.getUserWords();
      }
      getLevelGameButtons(this.getGameData, this.buttonsGroupContainer.element);
    } else {
      this.startGame();
    }
  }

  getUserWords = async () => {
    const { userId } = getState();
    const userWords = await getUserWords(userId);
    store.dispatch(setUserWords(userWords.content));
  };

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
    const page = Math.floor(Math.random() * pagesInGroupCount) + 1;
    this.state.group = group;
    this.state.page = page;
    await getWordsData(group, page);
    this.startGame();
  };

  setUsersWords = () => {
    const { userWords } = store.getState().toolkit;
    const { words } = store.getState().toolkit;
    const newWords = Array.from(new Set([...userWords, ...words].map(JSON.stringify))).map(JSON.parse);
    store.dispatch(setUserWords(newWords));
  };

  async startGame() {
    const { group, page, isStartGameFromMenu, isEndGame, isLogin } = this.state;
    await getWordsData(group, page);
    const { words } = store.getState().toolkit;
    const noLearnedWords = words.filter(({ optional }) => optional.isLearned !== true);
    let wordsForGame = isStartGameFromMenu ? words : noLearnedWords;
    this.state.wordsForGame = wordsForGame;
    if (wordsForGame.length < wordsPerPageCount) {
      wordsForGame = await this.addWordsForGame(wordsForGame);
    }
    const answers = this.state.wordsForGame.map((_, index) => this.getAnswers(index));
    this.state.answers = answers;
    if (isLogin) {
      getWordsLearned(isEndGame);
    }
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
    this.state.isEndGame = true;
    document.removeEventListener('keydown', this.keyboardEvents);
    if (this.state.isLogin) {
      this.setUserStatistics();
    }
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
    this.levelsLed = document.querySelectorAll('.level-led');
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
    if (!this.state.isLogin) {
      this.getQuestion();
    }
  }

  setCorrectResult() {
    if (this.state.isLogin) {
      this.updateUserWord(true);
    }
    if (this.state.isAudio) {
      playAudio(success);
    }
    this.state.correctAnswersSeries += 1;
    this.state.wrongAnswersSeries = 0;
    const { correctAnswersSeries } = this.state;
    switch (true) {
      case correctAnswersSeries > 5:
        this.state.level = SPRINT_LEVELS.third;
        this.state.prize = PRIZE_POINTS.thirty;
        break;
      case correctAnswersSeries > 2:
        this.state.level = SPRINT_LEVELS.second;
        this.state.prize = PRIZE_POINTS.twenty;
        break;
      default:
        this.state.level = SPRINT_LEVELS.first;
        this.state.prize = PRIZE_POINTS.ten;
    }
    const { prize, level, indexEnglishWord } = this.state;
    this.result = document.querySelector('.result');
    this.levelsLed[level - 1].classList.add('on');
    this.state.result += prize;
    this.state.correctAnswers.push(indexEnglishWord);
    this.result.textContent = this.state.result;
  }

  updateUserWord = async (result) => {
    const word = this.state.wordsForGame[this.state.question - 1];
    const attempts = word.optional.attempts + Number(result);
    const { id } = word;
    let { difficulty } = word;
    let { isLearned } = word.optional;
    const isHard = difficulty === DIFFICULTIES.easy;
    const correctAttemptsCount = getAttemptsCount(attempts);
    if (correctAttemptsCount === WORDS_LEARNED.easy && isHard) {
      isLearned = true;
    }
    if (correctAttemptsCount === WORDS_LEARNED.hard && !isHard) {
      isLearned = true;
      difficulty = DIFFICULTIES.easy;
    }
    if (correctAttemptsCount.toString() === WORDS_LEARNED.error) {
      isLearned = false;
    }
    const optional = { ...word.optional, attempts, isLearned };
    const userWordProperty = { difficulty, optional };
    const { userId } = getState();
    const isUserWordCreated = (await getUserWord({ userId, wordId: id })).success;
    if (isUserWordCreated) {
      await updateUserWord(userId, id, userWordProperty);
    } else {
      await createUserWord(userId, id, userWordProperty);
      this.state.newWords += 1;
    }
    this.getQuestion();
  };

  setWrongResult() {
    this.state.level = 1;
    const { level, isLogin, isAudio, longestSeries, correctAnswersSeries } = this.state;
    this.levelsLed.forEach((levelLed) => levelLed.classList.remove('on'));
    this.levelsLed[level - 1].classList.add('on');
    if (isLogin) {
      this.updateUserWord(false);
    }
    if (isAudio) {
      playAudio(failed);
    }
    this.state.longestSeries = longestSeries < correctAnswersSeries ? correctAnswersSeries : longestSeries;
    this.state.correctAnswersSeries = 0;
    this.state.wrongAnswersSeries += 1;
    this.state.wrongAnswers.push(this.state.indexEnglishWord);
  }

  endGame = () => {
    this.state.isEndGame = true;
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
    const { correctAnswers, wrongAnswers, longestSeries, newWords, isEndGame } = this.state;
    await getWordsLearned(isEndGame);
    const { endLearnedWords, startLearnedWords } = store.getState().toolkit;
    const learnedWords = endLearnedWords - startLearnedWords > 0 ? endLearnedWords - startLearnedWords : 0;
    const gameStat = {
      wrongAnswers: wrongAnswers.length,
      correctAnswers: correctAnswers.length,
      dateKey,
      game: 'sprint',
      learnedWords,
      newWords,
      longestSeries
    };
    await updateGameStatistic(gameStat);
    this.resetLearnedWordsState();
  };

  resetLearnedWordsState = () => {
    store.dispatch(setEndLearnedWords(0));
    store.dispatch(setStartLearnedWords(0));
  };
}
