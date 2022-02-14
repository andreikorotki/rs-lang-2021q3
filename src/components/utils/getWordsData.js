import { store } from '../store';
import { getWords } from '../api/words';
import { setWords } from '../store/toolkitReducer';
import { getWordsProperty } from '.';

export async function getWordsData(group, page) {
  const words = await getWords(group - 1, page - 1);
  const date = new Date().toISOString();
  const transformWords = words.items.map((word) => ({
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
  const wordsModified = getWordsProperty(transformWords);
  store.dispatch(setWords(wordsModified));
}
