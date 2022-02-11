import { store } from '../store';
import { getWords } from '../api/words';
import { setWords } from '../store/toolkitReducer';

export async function getWordsData(group, page) {
  const data = await getWords(group - 1, page - 1);
  const date = new Date().toISOString();
  const words = data.items.map((word) => ({
    ...word,
    difficulty: 'easy',
    optional: {
      isLearned: true,
      startDate: date,
      successAttempts: 0,
      failedAttempts: 0,
      lastAttemptSuccess: false,
      lastAttemptDate: date
    }
  }));
  store.dispatch(setWords(words));
}
