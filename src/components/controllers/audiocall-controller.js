import moment from 'moment';
import { getWords } from '../api/words';
import { NotEnoughWordsError } from '../common/exceptions/not-enough-words-error';
import { IncorrectRandomIndexError } from '../common/exceptions/incorrect-random-index-error';
import {
  audioCallVariantsCount,
  gameRoundsMaxCount,
  wordsPerPageCount,
  pagesInGroupCount,
  serverUrl
} from '../services/settings';
import { getUniqueRandomIndexes, playAudio } from '../services/utils';
import { store } from '../store';
import { calculateUserWord } from './words-controller';
import GameStatistic from '../models/game-statistic';
import { updateGameStatistic } from './statistics-controller';
import { Button } from '../common';
import AudioCallGameView from '../views/games/audiocall/audiocall-game-view';

export async function getWordsForGame(groupNum = 0) {
  // how many times we need to query api words for full rounds setup
  const queryTimes = Math.floor((gameRoundsMaxCount * audioCallVariantsCount) / wordsPerPageCount);
  const queriedWords = [];
  let wordsPromises = [];
  if (groupNum) {
    let randomPages;
    try {
      randomPages = getUniqueRandomIndexes(queryTimes, pagesInGroupCount); // random pages from group
    } catch (error) {
      if (error instanceof IncorrectRandomIndexError) {
        randomPages = [queryTimes];
      } else {
        throw error;
      }
    }
    wordsPromises = randomPages.map((pageNum) => getWords(groupNum, pageNum));
  } else {
    // get group and page from store
    const { group, page } = store.getState().toolkit;
    let pageCounter = page;
    let queryCounter = 0;
    while (pageCounter > 0 && queryCounter < queryTimes) {
      wordsPromises.push(getWords(group, pageCounter));
      queryCounter++;
      pageCounter--;
    }
  }
  const responses = await Promise.all(wordsPromises);
  responses.forEach((response) => queriedWords.push(response.items));
  // TODO filter learned words
  return Array.prototype.concat.apply([], queriedWords);
}

export function getLevelGameButtons(buttonsGroupContainer) {
  const buttonsGroup = 6;
  [...Array(buttonsGroup).keys()].forEach((group) => {
    const button = new Button(
      ['button-group', `button-group_color-${group + 1}`],
      `${group + 1}`,
      'button',
      `${group + 1}`,
      async () => {
        const words = await getWordsForGame(+group);
        const game = new AudioCallGameView(words);
        game.renderRound();
      }
    );
    buttonsGroupContainer.append(button.element);
  });
}

export class AudioCallGameController {
  constructor(words) {
    if (words.length < audioCallVariantsCount) {
      throw new NotEnoughWordsError('Not enough words for game');
    }
    this.roundWords = [];
    this.words = words;
    this.correctlyAnsweredWords = [];
    this.incorrectlyAnsweredWords = [];
    this.learnedWordsCount = 0;
    this.newWordsCount = 0;
    this.longestSeries = 0;
    this.gameDateKey = moment(new Date()).format('DD_MM_YYYY');
  }

  calculateRoundsCount() {
    const calculatedRounds = Math.floor(this.words.length / audioCallVariantsCount);
    return calculatedRounds < gameRoundsMaxCount ? calculatedRounds : gameRoundsMaxCount;
  }

  prepareRound() {
    this.mainWord = null; // reset main word;
    this.mainWordIndex = null;
    this.roundWords = [];
    this.setRoundWords();
    this.getMainWord();
  }

  setRoundWords() {
    const randomIndexes = [];
    const newWords = [];
    this.roundWords = [];
    while (randomIndexes.length < audioCallVariantsCount && this.words.length > audioCallVariantsCount) {
      const wordIndex = Math.floor(Math.random() * this.words.length);
      if (!randomIndexes.includes(wordIndex)) {
        randomIndexes.push(wordIndex);
      }
    }

    if (this.words.length === audioCallVariantsCount) {
      this.roundWords = this.words;
    } else {
      this.words.forEach((element, index) =>
        randomIndexes.includes(index) ? this.roundWords.push(element) : newWords.push(element)
      );
      this.words = newWords;
    }
  }

  getMainWord() {
    if (!this.mainWord) {
      const mainWordIndex = Math.floor(Math.random() * this.roundWords.length);
      this.mainWord = this.roundWords[mainWordIndex];
      this.mainWordIndex = mainWordIndex;
    }
    return this.mainWord;
  }

  getGameWords() {
    return this.words;
  }

  getRoundWords() {
    return this.roundWords;
  }

  getCorrectNum() {
    return Number(this.mainWordIndex) + 1;
  }

  async playMainWord() {
    playAudio(`${serverUrl}/${this.mainWord.audio}`);
  }

  async onAttempt(isSuccess) {
    const content = await calculateUserWord(this.mainWord.id, isSuccess);
    if (isSuccess) {
      this.longestSeries += 1;
    } else {
      this.longestSeries = 0;
    }
    if (content.isNew) {
      this.newWordsCount += 1;
    }
    if (content.isNewLearned) {
      this.learnedWordsCount += 1;
    }
    return content.word;
  }

  async addGameToUserStats() {
    const gameStat = new GameStatistic(
      'audiocall',
      this.gameDateKey,
      this.correctlyAnsweredWords.length,
      this.incorrectlyAnsweredWords.length,
      this.learnedWordsCount,
      this.newWordsCount,
      this.longestSeries
    );
    await updateGameStatistic(gameStat);
  }
}
