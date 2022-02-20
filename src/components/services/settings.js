export const serverUrl = 'https://rs-lang-vvk1978-app.herokuapp.com';
export const NAME_LOCAL_STORAGE = 'rs-lang-user-state';
export const tokenExpirationPeriodMs = 14400000; // 4 hours
export const wordsPerPageCount = 20;
export const gameRoundsMaxCount = 12;
export const audioCallVariantsCount = 5; // each audiocall game round contains such options count to select
export const pagesInGroupCount = 30;

export const messages = {
  SUCCESS: 'Успешно',
  LOGIN_SUCCESS: 'Успешный вход',
  USER_CREATED: 'Пользователь был успешно создан',
  INCORRECT_EMAIL_OR_PWD: 'Некорректый email или пароль',
  INCORRECT_TOKEN: 'Неверный токен',
  TOKEN_NOT_FOUND: 'Токен не найден. Выполните вход',
  USER_ALREADY_EXISTS: 'Пользователь с данным email уже существует',
  USER_NOT_FOUND: 'Пользователь с данным адресом электронной почты не существует',
  FILL_REQUIRED: 'Пожалуйста, заполните необходимые поля',
  PASS_LENGTH: 'Пароль должен созержать не менее 8 символов'
};

export const ResponseStatus = {
  SUCCESS: 200,
  CREATED: 201,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  ALREADY_EXISTS: 417,
  UNPROCESSABLE_DATA: 422
};
