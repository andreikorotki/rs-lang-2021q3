export default class BaseView {
  content;

  header;

  footer;

  element;

  constructor(contentElement) {
    const container = document.querySelector('.root');
    container.innerHTML = '';
    this.content = contentElement;
    container.append(this.content);
    this.element = container;
  }

  render() {
    return this.element;
  }
}
