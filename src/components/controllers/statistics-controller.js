import moment from 'moment';
import { Chart, registerables } from 'chart.js';
import { getUserStatistics, setUserStatistics } from '../api/users';
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
  }
  return { success: false, content: null };
}

export async function getStatisticsData() {
  if (isAuthorized()) {
    const state = getState();
    const { userId } = state;
    const statResponse = await getUserStatistics(userId);
    if (statResponse.success) {
      return { stats: statResponse.content };
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
          totalResults[key] += statsContent.stats.optional[game][todaysKey][key] || 0;
        } else {
          totalResults[key] = statsContent.stats.optional[game][todaysKey][key] || 0;
        }
      });
    }
  });
  keys.forEach((key) => {
    if (!totalResults[key]) {
      totalResults[key] = 0;
    }
  });
  return totalResults;
}

function drawDailyChart(chartData, chartRoot, game, gameChart) {
  const { correctAnswers, wrongAnswers, newWords, learnedWords, longestSeries } = chartData;
  const totalAnswers = correctAnswers || wrongAnswers ? correctAnswers + wrongAnswers : 1;
  const successRate = Math.round((correctAnswers * 100) / totalAnswers);
  const newWordsSpan = chartRoot.querySelector('.game-daily-new-words .change-stats');
  const learnedWordsSpan = chartRoot.querySelector('.game-daily-learned-words .change-stats');
  const longestSeriesSpan = chartRoot.querySelector('.game-daily-longest-series .change-stats');
  newWordsSpan.innerText = newWords;
  learnedWordsSpan.innerText = learnedWords;
  longestSeriesSpan.innerText = longestSeries;
  const realData = {
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
  const dummyData = {
    labels: [`Correct Answers`, `Wrong Answers`],
    datasets: [
      {
        label: 'Rate',
        data: [100, 100],
        backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)'],
        hoverOffset: 4
      }
    ]
  };
  const data = correctAnswers || wrongAnswers ? realData : dummyData;

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
    drawDailyChart(chartData, chartRoot, game, gameChart);
    if (!totalAnswers) {
      const zeroAttempts = `Пользователь не играл в ${gameTranslation} сегодня.`;
      drawMessageInSelector(`#${game}-message`, zeroAttempts);
    }
  } else {
    const notEnoughData = `Недостаточно данных. Пользователь не играл в ${gameTranslation} сегодня.`;
    drawMessageInSelector(`#${game}-message`, notEnoughData);
  }
}

function prepareCommonChartLabels(statsContent) {
  const audiocallLabels = Object.keys(statsContent.stats.optional.audiocall);
  const sprintLabels = Object.keys(statsContent.stats.optional.sprint);
  const sortedLabels = [...new Set([...audiocallLabels, ...sprintLabels])].sort((a, b) => a.localeCompare(b));
  return sortedLabels;
}

function buildNewWordsChart(sortedLabels, statsContent, formatedLabels) {
  const chartCanvas = document.getElementById(`new-words-chart`);
  const chartTitle = `Новые слова`.toLocaleUpperCase();
  const newWordsData = sortedLabels.map((label) => {
    const audioWord = statsContent.stats.optional.audiocall[label]?.newWords || 0;
    const sprintWord = statsContent.stats.optional.sprint[label]?.newWords || 0;
    return sprintWord + audioWord;
  });
  const data = {
    labels: formatedLabels,
    datasets: [
      {
        label: 'New Words Dataset',
        data: newWordsData,
        backgroundColor: ['rgba(255, 159, 64, 0.2)'],
        borderColor: ['rgb(255, 159, 64)'],
        borderWidth: 1
      }
    ]
  };

  const config = {
    type: 'bar',
    data,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        title: {
          display: true,
          text: chartTitle
        }
      }
    }
  };
  const chart = new Chart(chartCanvas, config); /* eslint-disable-line no-unused-vars */
}

export function buildLearnedWordsChart(sortedLabels, statsContent, formatedLabels) {
  const chartCanvas = document.getElementById(`learned-words-chart`);
  const chartTitle = `Изученные слова`.toLocaleUpperCase();
  const learnedWordsData = [];
  sortedLabels.reduce((prevDayLearned, currentDay, index) => {
    const audioWord = statsContent.stats.optional.audiocall[currentDay]?.learnedWords || 0;
    const sprintWord = statsContent.stats.optional.sprint[currentDay]?.learnedWords || 0;
    const totalLearned = sprintWord + audioWord;
    learnedWordsData[index] = prevDayLearned + totalLearned;
    return learnedWordsData[index];
  }, 0);
  const data = {
    labels: formatedLabels,
    datasets: [
      {
        label: 'Learned Words Dataset',
        data: learnedWordsData,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const config = {
    type: 'line',
    data,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        title: {
          display: true,
          text: chartTitle
        }
      }
    }
  };
  const chart = new Chart(chartCanvas, config); /* eslint-disable-line no-unused-vars */
}

export function buildCommonCharts(statsContent) {
  const sortedLabels = prepareCommonChartLabels(statsContent);
  const formatedLabels = sortedLabels.map((label) => label.replace(/_/g, '.'));

  buildNewWordsChart(sortedLabels, statsContent, formatedLabels);
  buildLearnedWordsChart(sortedLabels, statsContent, formatedLabels);
}

export async function buildCharts() {
  Chart.register(...registerables);
  const statsContent = await getStatisticsData();
  if (statsContent?.stats || statsContent?.words) {
    buildGameChart('total', 'Игры', statsContent);
    buildGameChart('audiocall', 'Аудиовызов', statsContent);
    buildGameChart('sprint', 'Спринт', statsContent);
  } else {
    const notEnoughData = 'Недостаточно данных для отображения статистики. Поиграйте в Аудиовызов или Спринт';
    drawMessageInSelector('.daily-charts', notEnoughData);
  }
}
