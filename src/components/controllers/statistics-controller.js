import { getUserStatistics, setUserStatistics } from '../api/users';
import UserStatistic from '../models/user-statistic';
import { isAuthorized } from '../services';
import { getState } from '../services/state';

export async function updateGameStatistic(gameStat) {
  if (isAuthorized()) {
    const state = getState();
    const { userId } = state;
    const response = await getUserStatistics(userId);
    if (response.success) {
      const dbStat = response.content;
      if (gameStat.dateKey in dbStat.optional[gameStat.game]) {
        const dbGameDate = dbStat.optional[gameStat.game][gameStat.dateKey];
        // update existing day stat
        if (gameStat.longestSeries > dbGameDate.longestSeries) {
          dbGameDate.longestSeries = gameStat.longestSeries;
        }
        dbGameDate.correctAnswers += gameStat.correctAnswers;
        dbGameDate.wrongAnswers += gameStat.wrongAnswers;
        dbGameDate.learnedWords += gameStat.learnedWords;
        dbGameDate.newWords += gameStat.newWords;
      } else {
        // add new day for game
        const { wrongAnswers, correctAnswers, learnedWords, newWords, longestSeries } = gameStat;
        dbStat.optional[gameStat.game][gameStat.dateKey] = {
          wrongAnswers,
          correctAnswers,
          learnedWords,
          newWords,
          longestSeries
        };
      }
      const updateStatResponse = await setUserStatistics(userId, dbStat);
      return updateStatResponse;
    }
    // create new statistic for user
    const userStat = new UserStatistic();
    const createStatResponse = await setUserStatistics(userId, userStat);
    if (createStatResponse.success) {
      updateGameStatistic(gameStat);
    }
  }
  return { success: false, content: null };
}
