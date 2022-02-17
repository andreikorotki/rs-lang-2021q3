import { DIFFICULTIES } from '../constants';
import Optional from './word-optional';

export default class UserWord {
  constructor(wordId, difficulty = DIFFICULTIES.easy, isLearned = false) {
    this.wordId = wordId;
    this.difficulty = difficulty;
    this.optional = new Optional(isLearned);
  }
}
