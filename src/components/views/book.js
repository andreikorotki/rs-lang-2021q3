/* eslint-disable no-unused-vars */
import BaseView from './base-view';
import Button from '../common/button';
import BaseElement from '../common/base-element';
import { getWords, getWord } from '../api/words';
import { serverUrl } from '../services/settings';

export default class Book extends BaseView {
  constructor() {
    const contentElement = document.createElement('section');
    contentElement.classList.add('book');
    super(contentElement);
    this.wrapper = new BaseElement('div', ['wrapper']);
    this.content.append(this.wrapper.element);
    this.wrapper.element.innerHTML = '<h2>Электронный учебник</h2>';
    this.buttonsGroupContainer = new BaseElement('div', ['buttons-group_container']);
    this.cardsContainer = new BaseElement('div', ['cards-container']);
    this.wrapper.element.append(this.buttonsGroupContainer.element);
    this.wrapper.element.append(this.cardsContainer.element);
    this.state = {
      group: 1,
      page: 1
    };
    this.run();
  }

  run() {
    this.getButtons();
    this.getWords();
    this.pagination();
  }

  getButtons() {
    const buttonsGroup = 6;
    [...Array(buttonsGroup).keys()].forEach((button) => {
      this.button = new Button(
        ['button-group', `color-${button + 1}`],
        `${button + 1}`,
        'button',
        `${button + 1}`,
        this.getGroup
      );
      this.buttonsGroupContainer.element.append(this.button.element);
    });
  }

  getGroup = (event) => {
    const { id } = event.target;
    this.state.group = +id;
    this.state.page = 1;
    this.getWords();
    this.getPages();
  };

  getWords = async () => {
    this.cardsContainer.element.innerHTML = '';
    const { group, page } = this.state;
    const words = await getWords(group - 1, page - 1);
    this.renderWords(words);
    this.setActiveGroup();
  };

  setActiveGroup() {
    const { group } = this.state;
    this.buttons = document.querySelectorAll('.button-group');
    this.buttons.forEach((button) => button.classList.remove('active'));
    this.buttons[group - 1].classList.add('active');
  }

  renderWords(words) {
    this.words = words.items;
    this.words.forEach((word) => {
      this.renderCardWord(word);
    });
    this.audioButtonClicks();
  }

  renderCardWord = async (data) => {
    const {
      id,
      image,
      word,
      wordTranslate,
      transcription,
      textExample,
      textMeaning,
      textExampleTranslate,
      textMeaningTranslate
    } = data;
    const html = `
      <div class="card" id="${id}">
        <img src="${serverUrl}/${image}" class="card-image"/>
        <div class="card-content">
          <div class="card-content_header">
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
      </div>
      `;
    await this.cardsContainer.element.insertAdjacentHTML('beforeend', html);
  };

  audioButtonClicks() {
    this.audioButtons = document.querySelectorAll('.audio-button');
    this.audioButtons.forEach((audioButton) => {
      audioButton.addEventListener('click', this.playWord);
    });
  }

  async playWord() {
    this.url = serverUrl;
    const { id } = this;
    const word = await getWord(id);
    const { audio, audioExample, audioMeaning } = word.items;
    const urlAudio = `${this.url}/${audio}`;
    const urlAudioExample = `${this.url}/${audioExample}`;
    const urlAudioMeaning = `${this.url}/${audioMeaning}`;
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

  pagination() {
    this.html = `
      <div class="pagination-container">
      </div>
    `;
    this.wrapper.element.insertAdjacentHTML('beforeend', this.html);
    this.buttonPrev = new Button(['button', 'arrow-prev', 'arrow'], '', 'button', 'prev', this.getPrevPages);
    this.buttonNext = new Button(['button', 'arrow-next', 'arrow'], '', 'button', 'next', this.getNextPages);
    const pagination = document.querySelector('.pagination-container');
    pagination.insertAdjacentElement('afterbegin', this.buttonPrev.element);
    pagination.insertAdjacentElement('beforeend', this.buttonNext.element);
    this.getPages();
  }

  getPages() {
    if (document.querySelector('.pages')) {
      document.querySelector('.pages').remove();
    }
    const { page } = this.state;
    const html = `
      <div class="pages">${page} / 30</div>
    `;
    this.buttonPrev.element.insertAdjacentHTML('afterend', html);
  }

  getPrevPages = () => {
    this.state.page -= 1;
    if (this.state.page < 1) {
      this.state.page = 1;
      return;
    }
    this.getPages();
    this.getWords();
  };

  getNextPages = () => {
    this.state.page += 1;
    if (this.state.page > 30) {
      this.state.page = 30;
      return;
    }
    this.getPages();
    this.getWords();
  };
}
