import BaseView from '../base-view';
import BaseElement from '../../common/base-element';
import Form from '../../common/form';
import Button from '../../common/button';

export class GameStartView extends BaseView {
  constructor(name, title) {
    const normalizedName = name.toString().toLowerCase();
    const startContent = new BaseElement('section', [`${normalizedName}-start`, 'game__section']);
    const gameWrapper = new BaseElement('div', [`${normalizedName}-wrapper`, 'game__wrapper']);
    const heading = new BaseElement('h2', [`${normalizedName}__title`, 'game-title'], title);
    gameWrapper.element.appendChild(heading.element);
    startContent.element.appendChild(gameWrapper.element);
    super(startContent.element);
    this.name = normalizedName;
  }

  buildForm() {
    const gameFormContainer = new BaseElement('div', ['game-form__container']);
    const gameForm = new Form(['form', 'game__form']);
    const selectorContainer = new BaseElement('div', ['select-group__container']);
    selectorContainer.element.innerHTML = `<select class="select-group" id="${this.name}-select-group">
                                            <option value="1">1 уровень</option>
                                            <option value="2">2 уровень</option>
                                            <option value="3">3 уровень</option>
                                            <option value="4">4 уровень</option>
                                            <option value="5">5 уровень</option>
                                            <option value="6">6 уровень</option>
                                          </select>`;

    const gameStartBtn = new Button(['btn', 'game-start__btn'], 'начать', 'button', `${this.name}-start-btn`);
    selectorContainer.element.appendChild(gameStartBtn.element);
    gameForm.element.appendChild(selectorContainer.element);
    gameFormContainer.element.appendChild(gameForm.element);
    this.content.firstChild.appendChild(gameFormContainer.element);
  }

  render() {
    this.buildForm();
    return this.element;
  }
}
