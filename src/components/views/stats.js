import { BaseElement } from '../common';
import { BaseView } from '.';
import { buildDailyCharts } from '../controllers/statistics-controller';

export default class Stats extends BaseView {
  constructor() {
    const main = new BaseElement('section', ['main']);
    const wrapper = new BaseElement('div', ['wrapper']);
    main.element.append(wrapper.element);
    super(main.element);
    this.content = new BaseElement('div', ['main-content']);
    wrapper.element.append(this.content.element);
  }

  async run() {
    this.render();
    await buildDailyCharts();
  }

  render = () => {
    const html = `
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
    this.content.element.insertAdjacentHTML('beforeend', html);
  };
}
