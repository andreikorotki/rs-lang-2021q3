import StatisticOptional from './statistic-optional';

export default class UserStatistic {
  constructor(userId = null, learnedWords = 0) {
    if (userId) {
      this.userId = userId;
    }
    this.learnedWords = learnedWords;
    this.optional = new StatisticOptional();
  }
}
