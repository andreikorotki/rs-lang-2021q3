export default class Button {
  element;

  constructor(
    cssClasses,
    textContent = '',
    type = 'button',
    id = '',
    handler = (event) => {
      event.preventDefault();
    },
    isDisabled = false
  ) {
    this.element = document.createElement('button');
    this.element.classList.add(...cssClasses);
    this.element.textContent = textContent;
    this.element.disabled = !!isDisabled;
    this.element.type = type;
    this.element.onclick = handler;
    if (id) {
      this.element.id = id;
    }
  }
}
