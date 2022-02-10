import { RegisterComponent } from './register-component';
import BaseElement from '../../common/base-element';
import BaseView from '../base-view';
import { setResetActiveLink } from '../../utils';

export default class RegisterView extends BaseView {
  constructor() {
    const content = new BaseElement('section', ['register__section']);
    const registerWrapper = new BaseElement('div', ['register__wrapper']);
    const heading = new BaseElement('h2', ['register__title'], 'Register');
    registerWrapper.element.appendChild(heading.element);
    const registerComponent = new RegisterComponent();
    registerWrapper.element.appendChild(registerComponent.render());
    content.element.appendChild(registerWrapper.element);
    super(content.element);
    this.handleClick();
  }

  handleClick = () => {
    const register = document.querySelector('.form-link');
    register.addEventListener('click', () => setResetActiveLink('.login-link'));
  };
}
