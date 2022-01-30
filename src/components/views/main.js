import BaseView from './base-view';

export default class Main extends BaseView {
  constructor() {
    const content = document.createElement('section');
    content.innerHTML = '<h1>Main!</h1>';
    super(content);
  }
}
