import RegisterComponent from './register-component';
import BaseElement from '../../common/base-element';
import BaseView from '../base-view';

export default class RegisterView extends BaseView {
  constructor() {
    const content = new BaseElement('section', ['regirster__section']);
    const heading = new BaseElement('h2', ['register__title'], 'Register');

    content.element.appendChild(heading.element);
    const registerComponent = new RegisterComponent();
    content.element.appendChild(registerComponent.render());
    super(content.element);
  }
}
