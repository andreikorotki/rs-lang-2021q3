import BaseView from './base-view';

export default class Book extends BaseView {
  constructor() {
    const contentElement = document.createElement('section');
    super(contentElement);
    this.content.innerHTML = '<h2>BOOK</h2>';
  }
}
