import { store } from '../store';

export function getWordsProperty(words) {
  const { userWords } = store.getState().toolkit;
  words.forEach((word, wordIndex) => {
    const index = userWords.findIndex((userWord) => word.id === userWord.wordId);
    if (index !== -1) {
      words[wordIndex].difficulty = userWords[index].difficulty;
      words[wordIndex].optional = userWords[index].optional;
    } else {
      const date = new Date().toISOString();
      words[wordIndex] = {
        ...word,
        difficulty: 'easy',
        optional: {
          attempts: ' ',
          isLearned: false,
          startDate: date,
          successAttempts: 0,
          failedAttempts: 0,
          lastAttemptSuccess: false,
          lastAttemptDate: date
        }
      };
    }
  });
  return words;
}
