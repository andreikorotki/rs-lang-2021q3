import { BaseElement } from '../../common';
import { BaseView } from '..';
import { getMainTemplate } from './main-template';

export default class Main extends BaseView {
  constructor() {
    const main = new BaseElement('section', ['main']);
    const wrapper = new BaseElement('div', ['wrapper', 'main-wrapper']);
    main.element.append(wrapper.element);
    super(main.element);
    this.content = new BaseElement('div', ['main-content']);
    wrapper.element.append(this.content.element);
  }

  run() {
    this.render();
  }

  render = () => {
    const html = getMainTemplate();
    this.content.element.insertAdjacentHTML('beforeend', html);
  };
}
