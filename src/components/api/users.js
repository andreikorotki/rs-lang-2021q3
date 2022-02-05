import { serverUrl, messages, ResponseStatus } from '../services/settings';
import { getToken } from '../services/state';

export const createUser = async (user) => {
  const response = await fetch(`${serverUrl}/users`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });

  if (response.status === ResponseStatus.SUCCESS || response.status === ResponseStatus.CREATED) {
    const content = await response.json();
    return { content, message: messages.USER_CREATED, success: true };
  }
  if (response.status === ResponseStatus.ALREADY_EXISTS) {
    return { message: messages.USER_ALREADY_EXISTS, success: false };
  }
  if (response.status === ResponseStatus.UNPROCESSABLE_DATA) {
    return { message: messages.INCORRECT_EMAIL_OR_PWD, success: false };
  }
  return { message: `Unexpected Response Code ${response.status}`, success: false };
};

export const loginUser = async (user) => {
  const response = await fetch(`${serverUrl}/signin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });

  if (response.status === ResponseStatus.SUCCESS || response.status === ResponseStatus.CREATED) {
    const content = await response.json();
    return { content, message: messages.LOGIN_SUCCESS, success: true };
  }
  if (response.status === ResponseStatus.UNAUTHORIZED) {
    return { message: messages.INCORRECT_EMAIL_OR_PWD, success: false };
  }
  if (response.status === ResponseStatus.NOT_FOUND) {
    return { message: messages.USER_NOT_FOUND, success: false };
  }
  return { message: `Unexpected Response Code ${response.status}`, success: false };
};

export const getUser = async (userId) => {
  const token = getToken();
  const response = await fetch(`${serverUrl}/users/${userId}`, {
    method: 'GET',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  });

  if (response.status === ResponseStatus.SUCCESS || response.status === ResponseStatus.CREATED) {
    const content = await response.json();
    return { content, message: messages.SUCCESS, success: true };
  }
  if (response.status === ResponseStatus.UNAUTHORIZED) {
    return { message: messages.INCORRECT_TOKEN, success: false };
  }
  return { message: `Unexpected Response code ${response.status}`, success: false };
};

export const getUserTokens = async (userId) => {
  const token = getToken();
  const response = await fetch(`${serverUrl}/users/${userId}/tokens`, {
    method: 'GET',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  });

  if (response.status.ok) {
    const content = await response.json();
    return { content, message: messages.LOGIN_SUCCESS, success: true };
  }
  if (response.status === ResponseStatus.FORBIDDEN) {
    return { message: messages.INCORRECT_TOKEN, success: false };
  }
  return { message: `Unexpected Response Code ${response.status}`, success: false };
};

export const createUserWord = async ({ userId, wordId, word }) => {
  const token = getToken();
  const response = await fetch(`${serverUrl}/users/${userId}/words/${wordId}`, {
    method: 'POST',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(word)
  });
  const content = await response.json();

  return content;
};

export const getUserWord = async ({ userId, wordId }) => {
  const token = getToken();
  const response = await fetch(`${serverUrl}/users/${userId}/words/${wordId}`, {
    method: 'GET',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  });
  return response.json();
};
