import { BaseView } from '.';
import { BaseElement } from '../common';

export default class About extends BaseView {
  constructor() {
    const contentElement = new BaseElement('section', ['about']);
    super(contentElement.element);
    this.content.innerHTML = '<h2>Hello from About</h2>';
  }
}
