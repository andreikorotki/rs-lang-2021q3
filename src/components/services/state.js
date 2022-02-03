import { messages } from './settings';

export function updateState(state) {
  localStorage.setItem('rs-lang-user-state', JSON.stringify(state));
}

function getState() {
  const state = localStorage.getItem('rs-lang-user-state');
  if (state) {
    return JSON.parse(state);
  }
  return undefined;
}

export function updateUserStateProp(propName, propVal) {
  const state = localStorage.getItem('rs-lang-user-state');
  if (state) {
    state[propName] = propVal;
    localStorage.setItem('rs-lang-user-state', JSON.stringify(state));
  } else {
    const newState = {};
    newState[propName] = propVal;
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
  const curDate = new Date();
  if (state) {
    return state.token && new Date(state.tokenExpireDate) > curDate;
  }
  return false;
}
