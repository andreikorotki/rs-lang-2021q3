export const getStatsTemplate = () => `
<h2 class="stats-heading">Статистика</h2>
<div class="charts">
  <div class="chart-item-wrapper" id="total-stats">
    <div class="chart-item">
      <canvas id="daily-total-chart" class="daily-chart"></canvas>
    </div>
    <div class="game-daily-info">
      <div class="game-daily-new-words"><span>Новых слов за сегодня: </span><span class="change-stats"></span></div>
      <div class="game-daily-learned-words"><span>Изучено слов за сегодня: </span><span class="change-stats"></span></div>
      <div class="game-daily-longest-series"><span>Самая длинная серия слов: </span><span class="change-stats"></span></div>
    </div>
  </div>
  <div class="chart-item-wrapper" id="audiocall-stats">
    <div class="chart-item">
      <canvas id="daily-audiocall-chart" class="daily-chart"></canvas>
      <div class="game-daily-info">
        <div class="game-daily-new-words"><span>Новых слов за сегодня: </span><span class="change-stats"></span></div>
        <div class="game-daily-learned-words"><span>Изучено слов за сегодня: </span><span class="change-stats"></span></div>
        <div class="game-daily-longest-series"><span>Самая длинная серия слов: </span><span class="change-stats"></span></div>
      </div>
    </div>
  </div>
  <div class="chart-item-wrapper" id="sprint-stats">
    <div class="chart-item">
      <canvas id="daily-sprint-chart" class="daily-chart"></canvas>
    </div>
    <div class="game-daily-info">
      <div class="game-daily-new-words"><span>Новых слов за сегодня: </span><span class="change-stats"></span></div>
      <div class="game-daily-learned-words"><span>Изучено слов за сегодня: </span><span class="change-stats"></span></div>
      <div class="game-daily-longest-series"><span>Самая длинная серия слов: </span><span class="change-stats"></span></div>
    </div>
  </div>
</div>
`;
