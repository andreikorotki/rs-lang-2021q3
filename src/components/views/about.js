import BaseView from './base-view';

export default class About extends BaseView {
  constructor() {
    const content = document.createElement('section');
    content.innerHTML = '<h2>Hello from About<h2>';
    super(content);
  }
}
