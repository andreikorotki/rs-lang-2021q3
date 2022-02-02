/* eslint-disable no-console */
import { serverUrl, messages } from '../services/settings';
import { getToken } from '../services/state';

export const createUser = async (user) => {
  const rawResponse = await fetch(`${serverUrl}/users`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });

  if (rawResponse.status === 200 || rawResponse.status === 201) {
    const content = await rawResponse.json();
    return { content, message: messages.USER_CREATED, success: true };
  }
  if (rawResponse.status === 417) {
    return { message: messages.USER_ALREADY_EXISTS, success: false };
  }
  if (rawResponse.status === 422) {
    return { message: messages.INCORRECT_EMAIL_OR_PWD, success: false };
  }
  return { message: `Unexpected Response Code ${rawResponse.status}`, success: false };
};

export const loginUser = async (user) => {
  const rawResponse = await fetch(`${serverUrl}/signin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });

  if (rawResponse.status === 200 || rawResponse.status === 201) {
    const content = await rawResponse.json();
    return { content, message: messages.LOGIN_SUCCESS, success: true };
  }
  if (rawResponse.status === 401) {
    return { message: messages.INCORRECT_EMAIL_OR_PWD, success: false };
  }
  if (rawResponse.status === 404) {
    return { message: messages.USER_NOT_FOUND, success: false };
  }
  return { message: `Unexpected Response Code ${rawResponse.status}`, success: false };
};

export const getUser = async (userId) => {
  const token = getToken();
  const rawResponse = await fetch(`${serverUrl}/users/${userId}`, {
    method: 'GET',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  });

  if (rawResponse.status === 200 || rawResponse.status === 201) {
    const content = await rawResponse.json();
    return { content, message: messages.SUCCESS, success: true };
  }
  if (rawResponse.status === 401) {
    return { message: messages.INCORRECT_TOKEN, success: false };
  }
  return { message: `Unexpected Response code ${rawResponse.status}`, success: false };
};

export const getUserTokens = async (userId) => {
  const token = getToken();
  const rawResponse = await fetch(`${serverUrl}/users/${userId}/tokens`, {
    method: 'GET',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  });

  if (rawResponse.status.ok) {
    const content = await rawResponse.json();
    return { content, message: messages.LOGIN_SUCCESS, success: true };
  }
  if (rawResponse.status === 403) {
    return { message: messages.INCORRECT_TOKEN, success: false };
  }
  return { message: `Unexpected Response Code ${rawResponse.status}`, success: false };
};

export const createUserWord = async ({ userId, wordId, word }) => {
  const token = getToken();
  const rawResponse = await fetch(`${serverUrl}/users/${userId}/words/${wordId}`, {
    method: 'POST',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(word)
  });
  const content = await rawResponse.json();

  return content;
};

export const getUserWord = async ({ userId, wordId }) => {
  const token = getToken();
  const rawResponse = await fetch(`${serverUrl}/users/${userId}/words/${wordId}`, {
    method: 'GET',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  });
  const content = await rawResponse.json();

  return content;
};
