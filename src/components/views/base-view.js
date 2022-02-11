export default class BaseView {
  element;

  constructor(contentElement) {
    const container = document.querySelector('.root');
    container.innerHTML = '';
    this.content = contentElement;
    container.append(this.content);
    this.element = container;
    this.element.appendChild(contentElement);
    this.content = this.element.firstChild;
  }

  render() {
    return this.element;
  }
}
