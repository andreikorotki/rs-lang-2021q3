import { BaseView } from '..';
import { BaseElement } from '../../common';
import { getAboutTemplate } from './about-template';

export default class About extends BaseView {
  constructor() {
    const contentElement = new BaseElement('section', ['about']);
    super(contentElement.element);
  }

  render() {
    const html = getAboutTemplate();
    this.content.innerHTML = html;
  }
}
