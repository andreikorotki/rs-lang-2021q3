import LoginComponent from './login-component';
import BaseElement from '../../common/base-element';
import BaseView from '../base-view';

export default class LoginView extends BaseView {
  constructor() {
    const content = new BaseElement('section', ['login__section']);
    const heading = new BaseElement('h2', ['login__title'], 'Sing In');

    content.element.appendChild(heading.element);
    const loginComponent = new LoginComponent();
    content.element.appendChild(loginComponent.render());
    super(content.element);
  }
}
