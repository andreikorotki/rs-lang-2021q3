import { Form, Button, Input, BaseElement } from '../../common';
import { createUserController } from '../../controllers/user-controller';
import { messages } from '../../services/settings';

export class RegisterComponent {
  constructor() {
    this.registerForm = new Form(['form', 'register__form'], 'register-form');
    this.userNameInput = new Input(
      ['input-text', 'user-register-name__input'],
      'text',
      'user-register-name-input',
      'user-register-name'
    );
    this.userNameLabel = new BaseElement('label', ['input-label'], 'Имя пользователя');
    this.nameInputGroup = new BaseElement('div', ['input-group']);
    this.userNameLabel.element.htmlFor = 'user-register-name';
    this.userEmailInput = new Input(
      ['input-text', 'user-register-email__input'],
      'email',
      'user-register-email-input',
      'user-register-email'
    );
    this.userEmailLabel = new BaseElement('label', ['input-label'], 'Email');
    this.emailInputGroup = new BaseElement('div', ['input-group']);
    this.userPasswordInput = new Input(
      ['input-password', 'user-password__input'],
      'password',
      'user-register-password-input',
      'register-password'
    );
    this.userPasswordLabel = new BaseElement('label', ['input-label'], 'Пароль');
    this.passwordInputGroup = new BaseElement('div', ['input-group']);
    this.message = new BaseElement('div', ['register-message'], '', 'register-message');
    this.registerBtn = new Button(
      ['btn', 'register__btn'],
      'Зарегистироваться',
      'button',
      'register-btn',
      async (e) => {
        e.preventDefault();
        await this.handleRegister();
      }
    );
    this.linkToLogin = new BaseElement('a', ['form-link'], 'Уже зарегистированы?');
  }

  render() {
    this.userNameInput.element.placeholder = 'Имя пользователя';
    this.userEmailInput.element.placeholder = 'Email';
    this.userEmailInput.element.autocomplete = 'username';
    this.userPasswordInput.element.placeholder = 'Пароль';
    this.userPasswordInput.element.minLength = 8;
    this.userEmailLabel.element.htmlFor = 'user-register-email';
    this.userPasswordInput.element.autocomplete = 'new-password';
    this.linkToLogin.element.href = '#/login';
    this.userNameInput.element.autocomplete = 'name';
    this.userPasswordLabel.element.htmlFor = 'register-password';
    this.build();
    return this.registerForm.element;
  }

  build() {
    this.registerForm.element.appendChild(this.message.element);
    this.nameInputGroup.element.appendChild(this.userNameInput.element);
    this.nameInputGroup.element.appendChild(this.userNameLabel.element);
    this.registerForm.element.appendChild(this.nameInputGroup.element);
    this.emailInputGroup.element.appendChild(this.userEmailInput.element);
    this.emailInputGroup.element.appendChild(this.userEmailLabel.element);
    this.registerForm.element.appendChild(this.emailInputGroup.element);
    this.passwordInputGroup.element.appendChild(this.userPasswordInput.element);
    this.passwordInputGroup.element.appendChild(this.userPasswordLabel.element);
    this.registerForm.element.appendChild(this.passwordInputGroup.element);
    this.registerForm.element.appendChild(this.registerBtn.element);
    this.registerForm.element.appendChild(this.linkToLogin.element);
  }

  async handleRegister() {
    const regMessage = document.getElementById('register-message');
    if (
      this.userNameInput.element.validity.valid &&
      this.userEmailInput.element.validity.valid &&
      this.userPasswordInput.element.validity.valid &&
      this.userPasswordInput.element.value.length > 8
    ) {
      const regData = await createUserController(
        this.userNameInput.element.value,
        this.userEmailInput.element.value,
        this.userPasswordInput.element.value
      );
      regMessage.innerText = regData.success ? '' : regData.message;
      if (!regData.success) {
        regMessage.innerText = regData.message;
      }
    } else {
      regMessage.innerText = messages.FILL_REQUIRED;
    }
  }
}
