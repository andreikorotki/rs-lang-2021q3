import moment from 'moment';

export default class GameStatistic {
  constructor(
    game,
    dateKey = moment(new Date()).format('DD_MM_YYYY'),
    correctCount = 0,
    wrongCount = 0,
    learnedCount = 0,
    newCount = 0,
    longestSeries = 0
  ) {
    this.game = game;
    this.dateKey = dateKey;
    this.correctAnswers = correctCount;
    this.wrongAnswers = wrongCount;
    this.learnedWords = learnedCount;
    this.newWords = newCount;
    this.longestSeries = longestSeries;
  }

  getDateStatObject() {
    const dayStatObject = {};
    const { wrongAnswers, correctAnswers, learnedWords, newWords, longestSeries } = this;
    dayStatObject[this.dateKey] = { wrongAnswers, correctAnswers, learnedWords, newWords, longestSeries };
    return dayStatObject;
  }
}
