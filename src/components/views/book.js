/* eslint-disable no-unused-vars */
import { BaseView } from '.';
import { Button, BaseElement } from '../common';
import { getWord } from '../api/words';
import { pagesInGroupCount, serverUrl, wordsPerPageCount } from '../services/settings';
import { store } from '../store';
import {
  setGroup,
  initial,
  nextPage,
  prevPage,
  setWords,
  updateUserWordProperty,
  updateWordProperty,
  setGameStartFromMenu,
  setUserWords,
  addUserWords
} from '../store/toolkitReducer';
import { bgColors, BUTTONS_GAME, BUTTONS_GROUP, DIFFICULTIES, HARD_GROUP, WORDS_LEARNED } from '../constants';
import { getWordsData } from '../utils';
import { getState } from '../services';
import { getUserWords, createUserWord, updateUserWord, getUserWord } from '../api/users';

export default class Book extends BaseView {
  constructor() {
    const contentElement = document.createElement('section');
    contentElement.classList.add('book');
    super(contentElement);
    this.wrapper = new BaseElement('div', ['wrapper']);
    this.content.append(this.wrapper.element);
    this.buttonsGroupContainer = new BaseElement('div', ['buttons-group_container']);
    this.buttonsGameContainer = new BaseElement('div', ['buttons-games_container']);
    this.cardsContainer = new BaseElement('div', ['cards-container']);
    this.wrapper.element.append(this.buttonsGroupContainer.element);
    this.wrapper.element.append(this.buttonsGameContainer.element);
    this.wrapper.element.append(this.cardsContainer.element);
    this.paginationContainer = new BaseElement('div', ['pagination-container']);
    this.wrapper.element.append(this.paginationContainer.element);
    this.authorized = getState();
    this.state = {
      group: store.getState().toolkit.group,
      page: store.getState().toolkit.page,
      isLogin: store.getState().toolkit.isLogin,
      isHardGroup: false,
      userId: this.authorized ? this.authorized.userId : ''
    };
  }

  async run() {
    if (this.state.isLogin) {
      await this.getUserWords();
      this.getGamesButtons();
    }
    document.body.style.background = `${bgColors[this.state.group - 1]}`;
    this.loader = new BaseElement('div', ['loader']);
    this.cardsContainer.element.append(this.loader.element);
    this.getGroupButtons();
    this.getWords();
    this.getPaginationButtons();
  }

  getUserWords = async () => {
    const userWords = await getUserWords(this.state.userId);
    store.dispatch(setUserWords(userWords));
  };

  getGroupButtons() {
    [...Array(BUTTONS_GROUP).keys()].forEach((button) => {
      this.button = new Button(
        ['button-group', `button-group_color-${button + 1}`],
        `${button + 1}`,
        'button',
        `${button + 1}`,
        this.getGroup
      );
      if (button === 6 && !this.state.isLogin) {
        return;
      }
      this.buttonsGroupContainer.element.append(this.button.element);
    });
  }

  getGamesButtons() {
    const games = ['Аудиовызов', 'Спринт'];
    const href = ['/#/audiocall', '/#/sprint'];
    [...Array(BUTTONS_GAME).keys()].forEach((button, index) => {
      this.button = new BaseElement('a', ['button-game'], `${games[index]}`, `${button + 1}`);
      this.button.element.href = `${href[index]}`;
      this.buttonsGameContainer.element.append(this.button.element);
    });
    this.gameClicks();
  }

  gameClicks = () => {
    this.buttonsGameContainer.element.addEventListener('click', this.startGame);
  };

  startGame = () => {
    store.dispatch(setGameStartFromMenu(false));
  };

  getGroup = ({ target: { id } }) => {
    store.dispatch(initial());
    store.dispatch(setGroup(Number(id)));
    this.state.group = Number(id);
    this.state.page = 1;
    document.body.style.background = `${bgColors[this.state.group - 1]}`;
    if (id === HARD_GROUP.toString()) {
      this.paginationContainer.element.style.display = 'none';
      this.getHardWordsPage();
    } else {
      this.paginationContainer.element.style.display = 'flex';
      this.getWords();
    }
  };

  getHardWordsPage() {
    this.buttonsGameContainer.element.style.display = 'none';
    const words = store.getState().toolkit.userWords;
    const hardWords = words.map(async ({ wordId, difficulty, optional }) => {
      const word = await getWord(wordId);
      return { ...word.items, difficulty, optional };
    });
    Promise.all(hardWords).then((data) => {
      store.dispatch(setWords(data));
      this.cardsContainer.element.innerHTML = '';
      this.renderHardWords();
      this.setActiveGroup();
    });
  }

  renderHardWords = () => {
    const { words } = store.getState().toolkit;
    words.forEach((word, index) => {
      if (word.difficulty === DIFFICULTIES.hard) {
        this.renderCardWord(word, index);
      }
    });
    this.buttonsClicks();
  };

  getWords = async () => {
    const { group, page } = this.state;
    await getWordsData(group, page);
    this.cardsContainer.element.innerHTML = '';
    this.renderWords();
    this.setActiveGroup();
    this.getPages();
  };

  async setActiveGroup() {
    const { group } = this.state;
    this.buttons = document.querySelectorAll('.button-group');
    this.buttons.forEach((button) => button.classList.remove('active'));
    this.buttons[group - 1].classList.add('active');
  }

  async renderWords() {
    const { words } = await store.getState().toolkit;
    words.forEach((word, index) => {
      this.renderCardWord(word, index);
    });
    this.buttonsClicks();
  }

  renderCardWord = async (
    {
      id,
      image,
      word,
      wordTranslate,
      transcription,
      textExample,
      textMeaning,
      textExampleTranslate,
      textMeaningTranslate,
      difficulty,
      optional
    },
    index
  ) => {
    let isHard = difficulty === DIFFICULTIES.hard;
    let { isLearned } = optional;
    const { attempts } = optional;
    const { isLogin, group } = this.state;
    const isAttempts = attempts.trim().slice(-1) === WORDS_LEARNED.error;
    const attemptsCount =
      attempts.length > 3 ? Array.from(attempts.trim().slice(-5)).reduce((acc, prev) => Number(acc) + Number(prev)) : 0;
    if (isAttempts) {
      const modifiedOptional = { ...optional, isLearned: false };
      isLearned = false;
      this.updateUserWordData(id, { difficulty, optional: modifiedOptional });
    }
    if (!isHard && attemptsCount >= WORDS_LEARNED.easy) {
      const modifiedOptional = { ...optional, isLearned: true };
      isLearned = true;
      this.updateUserWordData(id, { difficulty, optional: modifiedOptional });
    }
    if (isHard && attemptsCount === WORDS_LEARNED.hard) {
      const modifiedOptional = { ...optional, isLearned: true };
      isHard = false;
      isLearned = true;
      this.updateUserWordData(id, { difficulty: DIFFICULTIES.easy, optional: modifiedOptional });
    }
    const buttonLearned = `
      <button
        class="button-word button-word_learned ${isLearned ? 'learned' : ''}"
        id="add-learned"
        data-card=${index}>
          Изученное
      </button>
    `;
    const buttonHard = `
      <button
        class="button-word button-word_hard ${isHard ? 'hard' : ''}"
        id="add-hard"
        data-card=${index}>
          ${group === HARD_GROUP ? 'Из сложных' : 'В сложные'}
      </button>
    `;
    const html = `
      <div class="card" id="${id}">
        <div class="card-top_content">
          <img src="${serverUrl}/${image}" class="card-image"/>
          ${isLogin ? buttonHard : ''}
          ${isLogin ? buttonLearned : ''}
          <ul class="progress-container" title="Прогресс обучения">
          ${isLogin ? this.getProgressBar(attempts) : ''}
          </ul>
        </div>
        <div class="card-content">
          <div class="word-english">
            <p class="card-word_english">${word}</p>
            <button class="button audio-button" id="${id}" title="Прослушать..."></button>
          </div>
          <div class="word-russian">
            <span class="card-word">${wordTranslate}</span>
            <span class="card-word">${transcription}</span>
          </div>
          <div class="example-english">
            <p class="example-text">${textMeaning}</p>
            <p class="example-text_cursive">${textExample}</p>
          </div>
          <div class="example-russian">
            <p class="example-text">${textMeaningTranslate}</p>
            <p class="example-text_cursive">${textExampleTranslate}</p>
          </div>
        </div>
      </div>
      `;
    await this.cardsContainer.element.insertAdjacentHTML('beforeend', html);
  };

  getProgressBar = (attempts) => {
    let html = '';
    Array.from(attempts.trim().slice(-10)).forEach((attempt) => {
      html += this.renderProgressBar(attempt);
    });
    return html;
  };

  renderProgressBar = (attempt) => {
    const parsedAttempt = Boolean(Number(attempt));
    return `
      <li class="bar-item">
        <div class="bar-item_${parsedAttempt ? 'green' : 'red'}"></div>
      </li>
`;
  };

  buttonsClicks() {
    const audioButtons = document.querySelectorAll('.audio-button');
    audioButtons.forEach((audioButton) => {
      audioButton.addEventListener('click', this.playWord);
    });
    const hardButtons = document.querySelectorAll('.button-word_hard');
    hardButtons.forEach((hardButton) => {
      hardButton.addEventListener('click', (event) => this.addRemoveDifficulty(event));
    });
    const learnedButtons = document.querySelectorAll('.button-word_learned');
    learnedButtons.forEach((learnedButton) => {
      learnedButton.addEventListener('click', (event) => this.addLearnedWord(event));
    });
  }

  async playWord() {
    const { id } = this;
    const word = await getWord(id);
    const { audio, audioExample, audioMeaning } = word.items;
    const urlAudio = `${serverUrl}/${audio}`;
    const urlAudioExample = `${serverUrl}/${audioExample}`;
    const urlAudioMeaning = `${serverUrl}/${audioMeaning}`;
    const audioWord = new Audio(urlAudio);
    audioWord.play();
    audioWord.onended = () => {
      audioWord.src = urlAudioMeaning;
      audioWord.play();
      audioWord.onended = () => {
        audioWord.src = urlAudioExample;
        audioWord.play();
        audioWord.onended = () => {
          audioWord.pause();
        };
      };
    };
  }

  async addRemoveDifficulty({ target }) {
    this.setPageColorAllLearned();
    const { card } = target.dataset;
    const { group } = this.state;
    const word = JSON.parse(JSON.stringify(store.getState().toolkit.words[card]));
    const { optional, id } = word;
    if (target.classList.contains(DIFFICULTIES.hard) && group !== HARD_GROUP) {
      return;
    }
    if (group !== HARD_GROUP) {
      const wordsLearned = document.querySelectorAll('.button-word_learned');
      wordsLearned[card].classList.remove('learned');
      optional.isLearned = false;
    } else {
      this.removeDifficulty(word);
      return;
    }
    target.classList.add('hard');
    const userWordProperty = { difficulty: DIFFICULTIES.hard, optional };
    this.updateUserWordData(id, userWordProperty);
  }

  removeDifficulty = ({ id, optional }) => {
    const userWordData = { difficulty: DIFFICULTIES.easy, optional };
    updateUserWord(this.state.userId, id, userWordData);
    store.dispatch(updateUserWordProperty({ wordId: id, ...userWordData }));
    this.getHardWordsPage();
  };

  async addLearnedWord({ target }) {
    const { card } = target.dataset;
    const { group } = this.state;
    if (group === HARD_GROUP || target.classList.contains('learned')) {
      return;
    }
    if (group !== HARD_GROUP) {
      const wordsHard = document.querySelectorAll('.button-word_hard');
      wordsHard[card].classList.remove('hard');
    }
    target.classList.add('learned');
    const word = JSON.parse(JSON.stringify(store.getState().toolkit.words[card]));
    const { optional, id } = word;
    optional.isLearned = true;
    const userWordProperty = { difficulty: DIFFICULTIES.easy, optional };
    store.dispatch(updateWordProperty(word, userWordProperty));
    this.updateUserWordData(id, userWordProperty);
    this.setPageColorAllLearned();
  }

  updateUserWordData = async (id, userWordProperty) => {
    console.log(userWordProperty);
    const { userId } = getState();
    const isUserWordCreated = (await getUserWord({ userId, wordId: id })).success;
    if (isUserWordCreated) {
      updateUserWord(userId, id, userWordProperty);
      store.dispatch(updateUserWordProperty({ wordId: id, ...userWordProperty }));
    } else {
      createUserWord(userId, id, userWordProperty);
      store.dispatch(addUserWords({ wordId: id, ...userWordProperty }));
    }
  };

  setPageColorAllLearned = () => {
    const isAllLearnedWords = document.querySelectorAll('.learned').length === wordsPerPageCount;
    const pageCurrent = document.querySelector('.page-current');
    if (isAllLearnedWords) {
      pageCurrent.classList.add('learned');
      this.buttonsGameContainer.element.style.display = 'none';
    } else {
      pageCurrent.classList.remove('learned');
      this.buttonsGameContainer.element.style.display = 'flex';
    }
  };

  getPaginationButtons() {
    this.buttonPrev = new Button(['button', 'arrow-prev', 'arrow'], '', 'button', 'prev', this.getPrevPages);
    this.buttonNext = new Button(['button', 'arrow-next', 'arrow'], '', 'button', 'next', this.getNextPages);
    this.paginationContainer.element.append(this.buttonPrev.element);
    this.paginationContainer.element.append(this.buttonNext.element);
  }

  getPages() {
    if (document.querySelector('.pages')) {
      document.querySelector('.pages').remove();
    }
    const { page } = this.state;
    const html = `
      <div class="pages">
        <span class="page-current ">
          ${page}</span> / ${pagesInGroupCount}
      </div>
    `;
    this.buttonPrev.element.insertAdjacentHTML('afterend', html);
    this.setPageColorAllLearned();
  }

  getPrevPages = () => {
    store.dispatch(prevPage());
    this.state.page -= 1;
    if (this.state.page < 1) {
      this.state.page = 1;
      return;
    }
    this.getWords();
  };

  getNextPages = () => {
    store.dispatch(nextPage());
    this.state.page += 1;
    if (this.state.page > pagesInGroupCount) {
      this.state.page = pagesInGroupCount;
      return;
    }
    this.getWords();
  };
}
