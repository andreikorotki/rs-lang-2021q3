import Form from '../../common/form';
import Button from '../../common/button';
import Input from '../../common/input';
import BaseElement from '../../common/base-element';
import { createUserController } from '../../controllers/user-controller';
import { messages } from '../../services/settings';
import { redirect } from '../../services/router';

export default class RegisterComponent {
  constructor() {
    this.registerForm = new Form(['form', 'register__form'], 'register-form');
    this.userNameInput = new Input(
      ['input-text', 'user-register-name__input'],
      'text',
      'user-register-name-input',
      'user-register-name'
    );
    this.userEmailInput = new Input(
      ['input-text', 'user-register-email__input'],
      'email',
      'user-register-email-input',
      'user-register-email'
    );
    this.userPasswordInput = new Input(
      ['input-password', 'user-password__input'],
      'password',
      'user-register-password-input',
      'register-password'
    );
    this.message = new BaseElement('div', ['register-message'], '', 'register-message');
    this.registerBtn = new Button(['btn', 'register__btn'], 'register', 'button', 'register-btn', async (e) => {
      e.preventDefault();
      const regMessage = document.getElementById('register-message');
      if (
        this.userNameInput.element.validity.valid &&
        this.userEmailInput.element.validity.valid &&
        this.userPasswordInput.element.validity.valid
      ) {
        const regData = await createUserController(
          this.userNameInput.element.value,
          this.userEmailInput.element.value,
          this.userPasswordInput.element.value
        );
        regMessage.innerText = regData.success ? '' : regData.message;
        if (regData.success) {
          redirect('#/login');
        }
      } else {
        regMessage.innerText = messages.FILL_REQUIRED;
      }
    });

    this.userNameInput.element.autocomplete = true;
    this.registerForm.element.appendChild(this.message.element);
    this.registerForm.element.appendChild(this.userNameInput.element);
    this.registerForm.element.appendChild(this.userEmailInput.element);
    this.registerForm.element.appendChild(this.userPasswordInput.element);
    this.registerForm.element.appendChild(this.registerBtn.element);
  }

  render() {
    return this.registerForm.element;
  }
}
