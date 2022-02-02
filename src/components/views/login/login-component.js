/* eslint-disable no-console */
import Form from '../../common/form';
import Button from '../../common/button';
import Input from '../../common/input';
import BaseElement from '../../common/base-element';
import { loginUserController } from '../../controllers/user-controller';
import { messages } from '../../services/settings';
import { redirect } from '../../services/router';

export default class LoginComponent {
  constructor() {
    this.loginForm = new Form(['form', 'login__form'], 'login-form');
    this.userLoginInput = new Input(['input-text', 'user-login__input'], 'text', 'user-login-input', 'login');
    this.userLoginInput.element.autocomplete = true;
    this.userLoginInput.element.required = true;
    this.message = new BaseElement('div', ['login-message'], '', 'login-message');
    this.userPasswordInput = new Input(
      ['input-password', 'user-password__input'],
      'password',
      'user-password-input',
      'password'
    );
    this.userPasswordInput.element.required = true;
    this.loginBtn = new Button(['btn', 'login__btn'], 'login', 'submit', 'login-btn', async (e) => {
      e.preventDefault();
      const loginMessage = document.getElementById('login-message');
      if (this.userLoginInput.element.validity.valid && this.userPasswordInput.element.validity.valid) {
        const loginData = await loginUserController(
          this.userLoginInput.element.value,
          this.userPasswordInput.element.value
        );
        loginMessage.innerText = loginData.success ? '' : loginData.message;
        if (loginData.success) {
          redirect('#');
        }
      } else {
        loginMessage.innerText = messages.FILL_REQUIRED;
      }
    });
    this.userLoginInput.element.autocomplete = true;
    this.loginForm.element.appendChild(this.message.element);
    this.loginForm.element.appendChild(this.userLoginInput.element);
    this.loginForm.element.appendChild(this.userPasswordInput.element);
    this.loginForm.element.appendChild(this.loginBtn.element);
  }

  render() {
    return this.loginForm.element;
  }
}
