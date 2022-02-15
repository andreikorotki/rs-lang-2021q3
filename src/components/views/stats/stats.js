import { BaseElement } from '../../common';
import { BaseView } from '..';
import { buildCharts } from '../../controllers/statistics-controller';
import { getStatsTemplate } from './stats-template';

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
    await buildCharts();
  }

  render = () => {
    const html = getStatsTemplate();
    this.content.element.insertAdjacentHTML('beforeend', html);
  };
}
