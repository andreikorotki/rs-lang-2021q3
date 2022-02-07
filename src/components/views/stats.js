import { BaseElement } from '../common';
import { BaseView } from '.';

export default class Stats extends BaseView {
  constructor() {
    const main = new BaseElement('section', ['main']);
    const wrapper = new BaseElement('div', ['wrapper']);
    main.element.append(wrapper.element);
    super(main.element);
    this.content = new BaseElement('div', ['main-content']);
    wrapper.element.append(this.content.element);
  }

  run() {
    this.render();
  }

  render = () => {
    const html = `
      <h2>Статистика</h2>
    `;
    this.content.element.insertAdjacentHTML('beforeend', html);
  };
}
