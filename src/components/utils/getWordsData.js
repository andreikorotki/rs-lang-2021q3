import { store } from '../store';
import { getWords } from '../api/words';
import { setWords } from '../store/toolkitReducer';
import { getWordsProperty } from '.';

export async function getWordsData(group, page) {
  const data = await getWords(group - 1, page - 1);
  const date = new Date().toISOString();
  const words = data.items.map((word) => ({
    ...word,
    difficulty: 'easy',
    optional: {
      isLearned: false,
      startDate: date,
      successAttempts: 0,
      failedAttempts: 0,
      lastAttemptSuccess: false,
      lastAttemptDate: date
    }
  }));
  const wordsModified = getWordsProperty(words);
  store.dispatch(setWords(wordsModified));
}
