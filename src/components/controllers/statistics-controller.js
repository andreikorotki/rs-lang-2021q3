import moment from 'moment';
import { Chart, registerables } from 'chart.js';
import { getUserStatistics, getUserWords, setUserStatistics } from '../api/users';
import UserStatistic from '../models/user-statistic';
import { isAuthorized } from '../services';
import { getState } from '../services/state';
import { drawMessageInSelector } from '../utils/drawMessageInSelector';

function updateStatCounters(gameStat, dbStat) {
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
  return dbStat;
}

export async function updateGameStatistic(gameStat) {
  if (isAuthorized()) {
    const state = getState();
    const { userId } = state;
    const response = await getUserStatistics(userId);
    if (response.success) {
      let dbStat = response.content;
      dbStat = updateStatCounters(gameStat, dbStat);
      const updateStatResponse = await setUserStatistics(userId, dbStat);
      return updateStatResponse;
    }
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
    if (statResponse.success && wordsResponse.success) {
      return { stats: statResponse.content, words: wordsResponse.content };
    }
  }
  return {};
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

function drawChart(chartData, chartRoot, game, gameChart) {
  const { correctAnswers, wrongAnswers, newWords, learnedWords, longestSeries } = chartData;
  const totalAnswers = correctAnswers + wrongAnswers;
  const successRate = Math.round((correctAnswers * 100) / totalAnswers);
  const newWordsSpan = chartRoot.querySelector('.game-daily-new-words .change-stats');
  const learnedWordsSpan = chartRoot.querySelector('.game-daily-learned-words .change-stats');
  const longestSeriesSpan = chartRoot.querySelector('.game-daily-longest-series .change-stats');

  newWordsSpan.innerText = newWords;
  learnedWordsSpan.innerText = learnedWords;
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
}

function buildGameChart(game, gameTranslation, statsContent) {
  const chartRoot = document.getElementById(`${game}-stats`);
  const gameChart = document.getElementById(`daily-${game}-chart`);
  const todaysKey = moment(new Date()).format('DD_MM_YYYY');
  if (game === 'total' || statsContent.stats.optional[`${game}`][todaysKey]) {
    let chartData = {};
    if (game === 'total') {
      chartData = calculateTotals(todaysKey, statsContent);
    } else {
      chartData = statsContent.stats.optional[`${game}`][todaysKey];
    }
    const { correctAnswers, wrongAnswers } = chartData;
    const totalAnswers = correctAnswers + wrongAnswers;
    drawChart(chartData, chartRoot, game, gameChart);
    if (!totalAnswers) {
      const zeroAttempts = `Пользователь не играл в ${gameTranslation} сегодня.`;
      drawMessageInSelector(`#${game}-stats`, zeroAttempts);
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
