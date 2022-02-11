export const serverUrl = 'https://rs-lang-vvk1978-app.herokuapp.com';
export const tokenExpirationPeriodMs = 14400000; // 4 hours
export const wordsPerPageCount = 20;
export const gameRoundsMaxCount = 12;
export const audioCallVariantsCount = 5; // each audiocall game round contains such options count to select
export const pagesInGroupCount = 30;

export const messages = {
  SUCCESS: 'Success',
  LOGIN_SUCCESS: 'Success login',
  USER_CREATED: 'User was created',
  INCORRECT_EMAIL_OR_PWD: 'Incorrect e-mail or password',
  INCORRECT_TOKEN: 'Access token is missing, expired or invalid',
  TOKEN_NOT_FOUND: 'Token not fount. Login Required.',
  USER_ALREADY_EXISTS: 'User with given email already exists',
  USER_NOT_FOUND: 'User with given email was not found',
  FILL_REQUIRED: 'Please, fill required fields.'
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
