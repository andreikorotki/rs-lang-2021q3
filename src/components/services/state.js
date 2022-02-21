import { messages } from './settings';

export function updateState(state) {
  localStorage.setItem('rs-lang-user-state', JSON.stringify(state));
}

export function getState() {
  const state = localStorage.getItem('rs-lang-user-state');
  return state ? JSON.parse(state) : undefined;
}

export function updateUserStateProp(key, value) {
  const state = localStorage.getItem('rs-lang-user-state');
  if (state) {
    state[key] = value;
    localStorage.setItem('rs-lang-user-state', JSON.stringify(state));
  } else {
    const newState = {};
    newState[key] = value;
    localStorage.setItem('rs-lang-user-state', JSON.stringify(newState));
  }
}

export function getToken() {
  const state = getState();
  if (state) {
    return state.token;
  }
  throw new Error(messages.TOKEN_NOT_FOUND);
}

export function isAuthorized() {
  const state = getState();
  const currentDate = new Date();
  if (state) {
    return state.token && new Date(state.tokenExpireDate) > currentDate;
  }
  return false;
}

export function setGroupPage(state) {
  localStorage.setItem('book', JSON.stringify(state));
}

export function getGroupPage() {
  const state = localStorage.getItem('book');
  return state ? JSON.parse(state) : undefined;
}
