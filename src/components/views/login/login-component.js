import { Form, Button, Input, BaseElement } from '../../common';
import { loginUserController } from '../../controllers/user-controller';
import { messages } from '../../services/settings';
import { renderHeader } from '../../utils';

export default class LoginComponent {
  constructor() {
    this.loginForm = new Form(['form', 'login__form'], 'login-form');
    this.userLoginInput = new Input(['input-text', 'user-login__input'], 'text', 'user-login-input', 'login');
    this.userLoginLabel = new BaseElement('label', ['input-label'], 'E-mail');
    this.userLoginGroup = new BaseElement('div', ['input-group']);
    this.message = new BaseElement('div', ['login-message'], '', 'login-message');
    this.userPasswordInput = new Input(
      ['input-password', 'user-password__input'],
      'password',
      'user-password-input',
      'password'
    );
    this.userPasswordLabel = new BaseElement('label', ['input-label'], 'Пароль');
    this.userPasswordGroup = new BaseElement('div', ['input-group']);
    this.linkToRegister = new BaseElement('a', ['form-link'], 'Регистрация');
    this.linkToRegister.element.href = '#/register';
    this.loginBtn = new Button(['btn', 'login__btn'], 'войти', 'submit', 'login-btn', async (event) => {
      event.preventDefault();
      await this.handleLogin();
    });
  }

  render() {
    this.userLoginLabel.element.htmlFor = 'login';
    this.userLoginInput.element.autocomplete = 'username';
    this.userLoginInput.element.required = true;
    this.userLoginInput.element.placeholder = 'E-mail';
    this.userPasswordLabel.element.htmlFor = 'password';
    this.userPasswordInput.element.required = true;
    this.userPasswordInput.element.autocomplete = 'current-password';
    this.userPasswordInput.element.placeholder = 'Пароль';
    this.build();
    return this.loginForm.element;
  }

  build() {
    this.userLoginInput.element.autocomplete = true;
    this.loginForm.element.appendChild(this.message.element);
    this.userLoginGroup.element.appendChild(this.userLoginInput.element);
    this.userLoginGroup.element.appendChild(this.userLoginLabel.element);
    this.loginForm.element.appendChild(this.userLoginGroup.element);
    this.userPasswordGroup.element.appendChild(this.userPasswordInput.element);
    this.userPasswordGroup.element.appendChild(this.userPasswordLabel.element);
    this.loginForm.element.appendChild(this.userPasswordGroup.element);
    this.loginForm.element.appendChild(this.loginBtn.element);
    this.loginForm.element.appendChild(this.linkToRegister.element);
  }

  async handleLogin() {
    const loginMessage = document.getElementById('login-message');
    if (this.userLoginInput.element.validity.valid && this.userPasswordInput.element.validity.valid) {
      const loginData = await loginUserController(
        this.userLoginInput.element.value,
        this.userPasswordInput.element.value
      );
      loginMessage.innerText = loginData.success ? '' : loginData.message;
      if (!loginData.success) {
        loginMessage.innerText = messages.FILL_REQUIRED;
      }
      renderHeader();
    }
  }
}
