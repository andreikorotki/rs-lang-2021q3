import BaseElement from '../common/base-element';
import BaseView from './base-view';

export default class Main extends BaseView {
  constructor() {
    const content = new BaseElement('section', ['main']);
    const heading = new BaseElement('h1', ['main__title'], 'RS Lang');

    content.element.appendChild(heading.element);
    super(content.element);
  }
}
