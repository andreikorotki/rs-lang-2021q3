import moment from 'moment';
import { Chart, registerables } from 'chart.js';
import { getUserStatistics, getUserWords, setUserStatistics } from '../api/users';
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

export async function getStatisticsData() {
  if (isAuthorized()) {
    const state = getState();
    const { userId } = state;
    const statResponse = await getUserStatistics(userId);
    const wordsResponse = await getUserWords(userId);
    let stats;
    let words;
    if (statResponse.success && wordsResponse.success) {
      stats = statResponse.content;
      words = wordsResponse.content;
      return { stats, words };
    }
  }
  return {};
}

function drawMessageInSelector(querySelector, message) {
  const charts = document.querySelector(`${querySelector}`);
  charts.innerHTML = '';
  charts.innerHTML = `<p>${message}</p>`;
}

function calculateTotals(todaysKey, statsContent) {
  const keys = ['correctAnswers', 'wrongAnswers', 'newWords', 'learnedWords', 'longestSeries'];
  const totalResults = {};
  const games = ['audiocall', 'sprint'];
  games.forEach((game) => {
    if (todaysKey in statsContent.stats.optional[`${game}`]) {
      keys.forEach((key) => {
        if (key in totalResults) {
          totalResults[key] += statsContent.stats.optional[game][todaysKey][key];
        } else {
          totalResults[key] = statsContent.stats.optional[game][todaysKey][key];
        }
      });
    }
  });
  return totalResults;
}

function buildGameChart(game, gameTranslation, statsContent) {
  const chartRoot = document.getElementById(`${game}-stats`);
  const gameChart = document.getElementById(`daily-${game}-chart`);
  const todaysKey = moment(new Date()).format('DD_MM_YYYY');
  if (game === 'total' || todaysKey in statsContent.stats.optional[`${game}`]) {
    let { correctAnswers, wrongAnswers, newWords, learnedWords, longestSeries } = {};
    if (game === 'total') {
      ({ correctAnswers, wrongAnswers, newWords, learnedWords, longestSeries } = calculateTotals(
        todaysKey,
        statsContent
      ));
    } else {
      ({ correctAnswers, wrongAnswers, newWords, learnedWords, longestSeries } =
        statsContent.stats.optional[`${game}`][todaysKey]);
    }
    const totalAnswers = correctAnswers + wrongAnswers;
    const successRate = Math.round((correctAnswers * 100) / totalAnswers);
    const newWordsSpan = chartRoot.querySelector('.game-daily-new-words .change-stats');
    newWordsSpan.innerText = newWords;
    const learnedWordsSpan = chartRoot.querySelector('.game-daily-learned-words .change-stats');
    learnedWordsSpan.innerText = learnedWords;
    const longestSeriesSpan = chartRoot.querySelector('.game-daily-longest-series .change-stats');
    longestSeriesSpan.innerText = longestSeries;
    const data = {
      labels: [`Correct Answers ${successRate}%`, `Wrong Answers ${100 - successRate}%`],
      datasets: [
        {
          label: 'Rate',
          data: [correctAnswers, wrongAnswers],
          backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)'],
          hoverOffset: 4
        }
      ]
    };
    const chartTitle = `${game} Daily`.toLocaleUpperCase();
    const chartConfig = {
      type: 'doughnut',
      data,
      options: {
        plugins: {
          title: {
            display: true,
            text: chartTitle
          }
        }
      }
    };
    const chart = new Chart(gameChart, chartConfig); /* eslint-disable-line no-unused-vars */
    if (!totalAnswers) {
      const zeroAttmpts = `Пользователь не играл в ${gameTranslation} сегодня.`;
      drawMessageInSelector(`#${game}-stats`, zeroAttmpts);
    }
  } else {
    const notEnoughData = `Недостаточно данных. Пользователь не играл в ${gameTranslation} сегодня.`;
    drawMessageInSelector(`#${game}-stats`, notEnoughData);
  }
}

export async function buildDailyCharts() {
  Chart.register(...registerables);
  const statsContent = await getStatisticsData();

  if ('stats' in statsContent && 'words' in statsContent) {
    buildGameChart('total', 'Игры', statsContent);
    buildGameChart('audiocall', 'Аудиовызов', statsContent);
    buildGameChart('sprint', 'Спринт', statsContent);
  } else {
    const notEnoughData = 'Недостаточно данных для отображения статистики. Поиграйте в Аудиовызов или Спринт';
    drawMessageInSelector('.charts', notEnoughData);
  }
}
