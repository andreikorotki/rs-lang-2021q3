import { getUserWords } from '../api/users';
import { getState } from '../services';
import { getAttemptsCount } from '.';
import { store } from '../store';
import { setStartLearnedWords, setEndLearnedWords } from '../store/toolkitReducer';
import { DIFFICULTIES, WORDS_LEARNED } from '../constants';

export async function getWordsLearned(isEndGame) {
  const { userId } = getState();
  const words = (await getUserWords(userId)).content;
  let learnedWords = 0;
  words.forEach((word) => {
    const {
      difficulty,
      optional: { attempts, isLearned }
    } = word;
    const isHard = difficulty === DIFFICULTIES.easy;
    const correctAttemptsCount = getAttemptsCount(attempts);
    if (
      (correctAttemptsCount === WORDS_LEARNED.easy && isHard) ||
      correctAttemptsCount === WORDS_LEARNED.hard ||
      isLearned
    ) {
      learnedWords += 1;
    }
  });
  if (isEndGame) {
    store.dispatch(setEndLearnedWords(learnedWords));
  } else {
    store.dispatch(setStartLearnedWords(learnedWords));
  }
}
