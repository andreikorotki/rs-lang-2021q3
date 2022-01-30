export default class Form {
  element;

  constructor(cssClasses, action = 'POST', id = '') {
    this.element = document.createElement('form');
    this.element.classList.add(...cssClasses);
    this.element.action = action;
    if (id) {
      this.element.id = id;
    }
  }
}
