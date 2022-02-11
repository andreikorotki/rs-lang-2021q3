import { store } from '../store';
import { serverUrl } from '../services/settings';

export function getAudioUrl(idWord) {
  const { words } = store.getState().toolkit;
  const word = words.filter(({ id }) => id === idWord);
  const { audio } = word[0];
  return `${serverUrl}/${audio}`;
}
