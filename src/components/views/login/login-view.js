import LoginComponent from './login-component';
import BaseElement from '../../common/base-element';
import BaseView from '../base-view';

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
  }
}
