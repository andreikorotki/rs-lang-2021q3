export default class BaseElement {
  element;

  constructor(tag, cssClasses, content = '', id = '') {
    this.element = document.createElement(tag);
    this.element.classList.add(...cssClasses);
    if (content) {
      this.element.textContent = content;
    }
    if (id) {
      this.element.id = id;
    }
  }
}
