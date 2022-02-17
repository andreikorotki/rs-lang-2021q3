import { store } from '../store';
import { getWords } from '../api/words';
import { setWords } from '../store/toolkitReducer';
import { getWordsProperty } from '.';

export async function getWordsData(group, page) {
  const words = (await getWords(group - 1, page - 1)).items;
  const wordsModified = getWordsProperty(words);
  store.dispatch(setWords(wordsModified));
}
