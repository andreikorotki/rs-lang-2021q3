export const getStatsTemplate = () => `
<h2 class="stats-heading">Статистика</h2>
<h3 class="daily-charts-heading">Информация за текущий день</h3>
<div class="daily-charts">
  <div class="chart-item-wrapper" id="total-stats">
    <div class="chart-item">
      <canvas id="daily-total-chart" class="daily-chart"></canvas>
    </div>
    <div class="chart-message" id="total-message"></div>
    <div class="game-daily-info">
      <div class="game-daily-new-words"><span>Новых слов за сегодня: </span><span class="change-stats">0</span></div>
      <div class="game-daily-learned-words"><span>Изучено слов за сегодня: </span><span class="change-stats">0</span></div>
      <div class="game-daily-longest-series"><span>Самая длинная серия слов: </span><span class="change-stats">0</span></div>
    </div>
  </div>
  <div class="chart-item-wrapper" id="audiocall-stats">
    <div class="chart-item">
      <canvas id="daily-audiocall-chart" class="daily-chart"></canvas>
    </div>
      <div class="chart-message" id="audiocall-message"></div>
      <div class="game-daily-info">
        <div class="game-daily-new-words"><span>Новых слов за сегодня: </span><span class="change-stats">0</span></div>
        <div class="game-daily-learned-words"><span>Изучено слов за сегодня: </span><span class="change-stats">0</span></div>
        <div class="game-daily-longest-series"><span>Самая длинная серия слов: </span><span class="change-stats">0</span></div>
      </div>
  </div>
  <div class="chart-item-wrapper" id="sprint-stats">
    <div class="chart-item">
      <canvas id="daily-sprint-chart" class="daily-chart"></canvas>
    </div>
    <div class="chart-message" id="sprint-message"></div>
    <div class="game-daily-info">
      <div class="game-daily-new-words"><span>Новых слов за сегодня: </span><span class="change-stats">0</span></div>
      <div class="game-daily-learned-words"><span>Изучено слов за сегодня: </span><span class="change-stats">0</span></div>
      <div class="game-daily-longest-series"><span>Самая длинная серия слов: </span><span class="change-stats">0</span></div>
    </div>
  </div>
</div>
<h3 class="common-charts-heading">Информация за всё время</h3>
<div class="common-charts">
  <div class="common-chart-item" id="new-words-stats">
    <canvas id="new-words-chart" class="common-chart"></canvas>
  </div>
  <div class="common-chart-item" id="learned-words-stats">
    <canvas id="learned-words-chart" class="common-chart"></canvas>
  </div>
</div>
`;
