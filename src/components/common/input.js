export default class Input {
  element;

  name;

  constructor(cssStyles, type, name, id = '', value = '') {
    this.element = document.createElement('input');
    this.element.classList.add(...cssStyles);
    this.element.type = type;
    this.name = name;
    if (value) {
      this.element.value = value;
    }
    if (id) {
      this.element.id = id;
    }
  }
}
