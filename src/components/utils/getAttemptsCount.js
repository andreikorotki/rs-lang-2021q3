import { WORDS_LEARNED } from '../constants';

export function getAttemptsCount(attempts) {
  try {
    const correctAttemptsCount = Array.from(attempts.trim().slice(WORDS_LEARNED.last)).reduce((prev, curr) => {
      if (curr === WORDS_LEARNED.error) {
        return 0;
      }
      return Number(prev) + Number(curr);
    }, 0);
    return correctAttemptsCount;
  } catch (error) {
    return 0;
  }
}
