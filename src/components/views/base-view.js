export default class BaseView {
  content;

  header;

  footer;

  element;

  constructor(contentElement) {
    const container = document.querySelector('.root');
    container.innerHTML = ''; // reset content
    this.content = contentElement;
    container.appendChild(this.content);
    this.element = container;
  }

  render() {
    return this.element;
  }
}
