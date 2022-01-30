import BaseView from './base-view';

export default class About extends BaseView {
  constructor() {
    const contentElement = document.createElement('section');
    super(contentElement);
    this.content.innerHTML = '<h2>Hello from About</h2>';
  }
}
