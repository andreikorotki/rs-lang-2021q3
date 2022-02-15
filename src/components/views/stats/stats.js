import { BaseElement } from '../../common';
import { BaseView } from '..';
import { buildCharts } from '../../controllers/statistics-controller';
import { getStatsTemplate } from './stats-template';

export default class Stats extends BaseView {
  constructor() {
    const main = new BaseElement('section', ['stats']);
    const wrapper = new BaseElement('div', ['wrapper']);
    main.element.append(wrapper.element);
    super(main.element);
    this.content = new BaseElement('div', ['stats-content']);
    wrapper.element.append(this.content.element);
  }

  async run() {
    this.render();
    await buildCharts();
  }

  render = () => {
    const html = getStatsTemplate();
    this.content.element.insertAdjacentHTML('beforeend', html);
  };
}
