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
// import { registerWordAttempt } from './words-controller';

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

export class AudioCallGameController {
  constructor(words) {
    if (words.length < audioCallVariantsCount) {
      throw new NotEnoughWordsError('Not enough words for game');
    }
    this.roundWords = [];
    this.words = words;
    this.correctlyAnsweredWords = [];
    this.incorrectlyAnsweredWords = [];
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

  // async setMainWordAttempt(isSuccess) {
  //   return registerWordAttempt(this.mainWord.id, isSuccess);
  // }
}
