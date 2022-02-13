/* eslint-disable no-unused-vars */
import { BaseView } from '.';
import { Button, BaseElement } from '../common';
import { getWord } from '../api/words';
import { serverUrl } from '../services/settings';
import { store } from '../store';
import {
  setGroup,
  initial,
  nextPage,
  prevPage,
  setWords,
  updateUserWordProperty,
  addLearnedPages,
  setGameStartFromMenu,
  setUserWords,
  addUserWords
} from '../store/toolkitReducer';
import { bgColors } from '../constants';
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
      this.getGamesButtons();
      await this.getUserWords();
    }
    document.body.style.background = `${bgColors[this.state.group - 1]}`;
    this.loader = new BaseElement('div', ['loader']);
    this.cardsContainer.element.append(this.loader.element);
    this.getGroupButtons();
    this.getWords();
    this.getPaginationButtons();
    this.getPages();
  }

  getUserWords = async () => {
    const data = await getUserWords(this.state.userId);
    store.dispatch(setUserWords(data));
  };

  getGroupButtons() {
    const buttonsGroup = 7;
    [...Array(buttonsGroup).keys()].forEach((button) => {
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
    const buttonsGame = 2;
    const games = ['Аудиовызов', 'Спринт'];
    const href = ['/#/audiocall', '/#/sprint'];
    [...Array(buttonsGame).keys()].forEach((button, index) => {
      this.button = new BaseElement('a', ['button-game'], `${games[index]}`, `${button + 1}`);
      this.button.element.href = `${href[index]}`;
      this.buttonsGameContainer.element.append(this.button.element);
    });
    this.gameClicks();
  }

  gameClicks = () => {
    this.buttonsGameContainer.element.addEventListener('click', () => this.startGame());
  };

  startGame = () => {
    store.dispatch(setGameStartFromMenu(false));
  };

  getGroup = (event) => {
    const { id } = event.target;
    store.dispatch(initial());
    store.dispatch(setGroup(Number(id)));
    this.state.group = Number(id);
    this.state.page = 1;
    document.body.style.background = `${bgColors[+id - 1]}`;
    if (id === '7') {
      this.paginationContainer.element.style.display = 'none';
      this.getHardWordsPage();
    } else {
      this.paginationContainer.element.style.display = 'flex';
      this.getWords();
      this.getPages();
    }
  };

  getHardWordsPage() {
    const words = store.getState().toolkit.userWords;
    const hardWords = words.map(async ({ wordId, difficulty, optional }) => {
      const word = await getWord(wordId);
      return { ...word.items, difficulty, optional };
    });
    Promise.all(hardWords)
      .then((data) => store.dispatch(setWords(data)))
      .then(() => {
        this.cardsContainer.element.innerHTML = '';
        this.renderHardWords();
        this.setActiveGroup();
      });
  }

  renderHardWords = () => {
    const { words } = store.getState().toolkit;
    words.forEach((word, index) => {
      if (word.difficulty === 'hard') {
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
  };

  async setActiveGroup() {
    const { group } = this.state;
    this.buttons = document.querySelectorAll('.button-group');
    this.buttons.forEach((button) => button.classList.remove('active'));
    this.buttons[group - 1].classList.add('active');
  }

  renderWords() {
    const { words } = store.getState().toolkit;
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
    const isHard = difficulty === 'hard';
    const { isLearned } = optional;
    const { isLogin } = this.state;
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
          ${this.state.group === 7 ? 'Из сложных' : 'В сложные'}
      </button>
    `;
    const html = `
      <div class="card" id="${id}">
        <div class="card-top_content">
          <img src="${serverUrl}/${image}" class="card-image"/>
          ${isLogin ? buttonHard : ''}
          ${isLogin ? buttonLearned : ''}
          <ul class="progress-container" title="Прогресс обучения">
          ${isLogin ? this.getProgressBar() : ''}
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

  getProgressBar = () => {
    const answers = [1, 1, 1, 0, 0, 0, 1, 1, 1, 1];
    let html = '';
    answers.forEach((answer) => {
      html += this.renderProgressBar(answer);
    });
    return html;
  };

  renderProgressBar = (answer) => {
    return `
      <li class="bar-item">
        <div class="bar-item_${answer ? 'green' : 'red'}"></div>
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

  async addRemoveDifficulty(event) {
    const { target } = event;
    const { card } = target.dataset;
    const { group } = this.state;
    const word = JSON.parse(JSON.stringify(store.getState().toolkit.words[card]));
    const { optional } = word;
    if (target.classList.contains('hard') && group !== 7) {
      return;
    }
    if (group !== 7) {
      const wordsLearned = document.querySelectorAll('.button-word_learned');
      wordsLearned[card].classList.remove('learned');
      optional.isLearned = false;
    }
    if (group === 7) {
      this.removeDifficulty(word);
      return;
    }
    target.classList.add('hard');
    const userWordProperty = { difficulty: 'hard', optional };
    this.updateUserWordData(word, userWordProperty);
  }

  removeDifficulty = (word) => {
    const { id } = word;
    const userWordData = { difficulty: 'easy', optional: word.optional };
    updateUserWord(this.state.userId, id, userWordData);
    store.dispatch(updateUserWordProperty({ wordId: id, ...userWordData }));
    this.getHardWordsPage();
  };

  async addLearnedWord(event) {
    const { target } = event;
    const { card } = target.dataset;
    const { group } = this.state;
    if (group === 7) {
      return;
    }
    if (target.classList.contains('learned')) {
      return;
    }
    if (group !== 7) {
      const wordsHard = document.querySelectorAll('.button-word_hard');
      wordsHard[card].classList.remove('hard');
    }
    target.classList.add('learned');
    const word = JSON.parse(JSON.stringify(store.getState().toolkit.words[card]));
    const { optional } = word;
    optional.isLearned = true;
    const userWordProperty = { difficulty: 'easy', optional };
    this.updateUserWordData(word, userWordProperty);
    this.setPageColorAllLearned();
  }

  async updateUserWordData(word, userWordProperty) {
    const { id } = word;
    const isUserWordCreated = (await getUserWord({ userId: this.state.userId, wordId: id })).success;
    if (isUserWordCreated) {
      updateUserWord(this.state.userId, id, userWordProperty);
      store.dispatch(updateUserWordProperty({ wordId: id, ...userWordProperty }));
    } else {
      createUserWord(this.state.userId, id, userWordProperty);
      store.dispatch(addUserWords({ ...userWordProperty, wordId: id }));
    }
  }

  setPageColorAllLearned = () => {
    const isAllLearnedWords = document.querySelectorAll('.learned').length === 20;
    if (isAllLearnedWords) {
      const pageCurrent = document.querySelector('.page-current');
      pageCurrent.classList.add('learned');
      const { group, page } = this.state;
      store.dispatch(addLearnedPages({ group, page }));
    }
  };

  getPaginationButtons() {
    this.buttonPrev = new Button(['button', 'arrow-prev', 'arrow'], '', 'button', 'prev', this.getPrevPages);
    this.buttonNext = new Button(['button', 'arrow-next', 'arrow'], '', 'button', 'next', this.getNextPages);
    this.paginationContainer.element.append(this.buttonPrev.element);
    this.paginationContainer.element.append(this.buttonNext.element);
  }

  getPages() {
    const { learnedPages } = store.getState().toolkit;
    const isLearnedPages =
      learnedPages.findIndex(({ group, page }) => this.state.group === group && this.state.page === page) !== -1;
    if (document.querySelector('.pages')) {
      document.querySelector('.pages').remove();
    }
    const { page } = this.state;
    const html = `
      <div class="pages">
        <span class="page-current ${isLearnedPages ? 'learned' : ''}">
          ${page}</span> / 30
      </div>
    `;
    this.buttonPrev.element.insertAdjacentHTML('afterend', html);
  }

  getPrevPages = () => {
    store.dispatch(prevPage());
    this.state.page -= 1;
    if (this.state.page < 1) {
      this.state.page = 1;
      return;
    }
    this.getPages();
    this.getWords();
  };

  getNextPages = () => {
    store.dispatch(nextPage());
    this.state.page += 1;
    if (this.state.page > 30) {
      this.state.page = 30;
      return;
    }
    this.getPages();
    this.getWords();
  };
}
