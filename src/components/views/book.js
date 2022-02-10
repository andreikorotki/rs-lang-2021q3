/* eslint-disable no-unused-vars */
import { BaseView } from '.';
import { Button, BaseElement } from '../common';
import { getWords, getWord } from '../api/words';
import { serverUrl } from '../services/settings';
import { store } from '../store';
import {
  setGroup,
  initial,
  nextPage,
  prevPage,
  setWords,
  addHardWord,
  deleteHardWord,
  addLearnedWord,
  addLearnedPages,
  setGameStartFromMenu
} from '../store/toolkitReducer';
import { bgColors } from '../constants';

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
    this.state = {
      group: store.getState().toolkit.group,
      page: store.getState().toolkit.page,
      isLogin: store.getState().toolkit.isLogin,
      isHardGroup: false
    };
  }

  run() {
    document.body.style.background = `${bgColors[this.state.group - 1]}`;
    this.loader = new BaseElement('div', ['loader']);
    this.cardsContainer.element.append(this.loader.element);
    this.getGroupButtons();
    if (this.state.isLogin) {
      this.getGamesButtons();
    }
    this.getWords();
    this.getPaginationButtons();
    this.getPages();
  }

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
    const { hardWords } = store.getState().toolkit;
    store.dispatch(setWords(hardWords));
    this.cardsContainer.element.innerHTML = '';
    this.renderWords();
    this.setActiveGroup();
  }

  getWords = async () => {
    const { group, page } = this.state;
    const data = await getWords(group - 1, page - 1);
    const words = data.items;
    this.cardsContainer.element.innerHTML = '';
    store.dispatch(setWords(words));
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
    const { hardWords } = store.getState().toolkit;
    const { learnedWords } = store.getState().toolkit;
    words.forEach((word, index) => {
      this.renderCardWord(word, index, hardWords, learnedWords);
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
      textMeaningTranslate
    },
    index,
    hardWords,
    learnedWords
  ) => {
    const isHard = hardWords.findIndex((hardWord) => hardWord.id === id) === -1;
    const isLearned = learnedWords.findIndex((learnedWord) => learnedWord.id === id) === -1;
    const buttonLearned = `
            <button
              class="button-word button-word_learned ${!isLearned ? 'learned' : ''}"
              id="add-learned"
              data-card=${index}>
                Изученное
            </button>
          `;
    const buttonHard = `
            <button
              class="button-word button-word_hard ${!isHard ? 'hard' : ''}"
              id="add-hard"
              data-card=${index}>
                ${this.state.group === 7 ? 'Из сложных' : 'В сложные'}
            </button>
          `;
    const html = `
      <div class="card" id="${id}">
        <div class="card-top_content">
          <img src="${serverUrl}/${image}" class="card-image"/>
          ${this.state.isLogin ? buttonHard : ''}
          ${this.state.isLogin ? buttonLearned : ''}
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

  buttonsClicks() {
    const audioButtons = document.querySelectorAll('.audio-button');
    audioButtons.forEach((audioButton) => {
      audioButton.addEventListener('click', this.playWord);
    });
    const hardButtons = document.querySelectorAll('.button-word_hard');
    hardButtons.forEach((hardButton) => {
      hardButton.addEventListener('click', (event) => this.addHardWord(event));
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

  addHardWord(event) {
    const { target } = event;
    const { group } = this.state;
    const { card } = target.dataset;
    const hardWord = store.getState().toolkit.words[card];
    const { hardWords } = store.getState().toolkit;
    const isId = hardWords.findIndex(({ id }) => id === hardWord.id) === -1;

    if (group === 7) {
      store.dispatch(deleteHardWord(hardWord.id));
      this.getHardWordsPage();
    }

    target.classList.add('hard');
    if (isId) {
      store.dispatch(addHardWord(hardWord));
    }
  }

  addLearnedWord = (event) => {
    const { target } = event;
    const { card } = target.dataset;
    const learnedWord = store.getState().toolkit.words[card];
    const { learnedWords } = store.getState().toolkit;
    const isId = learnedWords.findIndex(({ id }) => id === learnedWord.id) === -1;
    target.classList.add('learned');
    if (isId) {
      store.dispatch(addLearnedWord(learnedWord));
    }
    this.setPageColorAllLearned();
  };

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
        <span class="page-current ${isLearnedPages ? 'learned' : ''}">${page}</span>
        / 30
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
