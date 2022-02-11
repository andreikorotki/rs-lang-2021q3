import { store } from '../store';
import { getWords } from '../api/words';
import { setWords } from '../store/toolkitReducer';

export async function getWordsData(group, page) {
  const data = await getWords(group - 1, page - 1);
  const words = data.items;
  store.dispatch(setWords(words));
}
