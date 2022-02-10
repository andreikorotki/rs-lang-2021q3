import { LoginComponent } from '.';
import { BaseElement } from '../../common';
import { BaseView } from '..';
import { setResetActiveLink } from '../../utils';

export default class LoginView extends BaseView {
  constructor() {
    const content = new BaseElement('section', ['login__section']);
    const loginWrapper = new BaseElement('div', ['login__wrapper']);
    const heading = new BaseElement('h2', ['login__title'], 'Sing In');
    loginWrapper.element.appendChild(heading.element);
    const loginComponent = new LoginComponent();
    loginWrapper.element.appendChild(loginComponent.render());
    content.element.appendChild(loginWrapper.element);
    super(content.element);
    this.handleClick();
  }

  handleClick = () => {
    const register = document.querySelector('.form-link');
    register.addEventListener('click', () => setResetActiveLink('.register-link'));
  };
}
