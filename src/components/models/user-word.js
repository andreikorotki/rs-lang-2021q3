import Optional from './word-optional';

export default class UserWord {
  constructor(wordId, difficulty = 'easy', isLearned = false) {
    this.wordId = wordId;
    this.difficulty = difficulty;
    this.optional = new Optional(isLearned);
  }
}
