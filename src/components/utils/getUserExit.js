import { store } from '../store';
import { renderHeader } from '.';
import { NAME_LOCAL_STORAGE } from '../services/settings';
import { setAuthorized } from '../store/toolkitReducer';

export function getUserExit() {
  localStorage.clear(`${NAME_LOCAL_STORAGE}`);
  store.dispatch(setAuthorized(false));
  renderHeader();
}
