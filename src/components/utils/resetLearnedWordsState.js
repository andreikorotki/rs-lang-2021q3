import { store } from '../store';
import { setStartLearnedWords, setEndLearnedWords } from '../store/toolkitReducer';

export function resetLearnedWordsState() {
  store.dispatch(setEndLearnedWords(0));
  store.dispatch(setStartLearnedWords(0));
}
