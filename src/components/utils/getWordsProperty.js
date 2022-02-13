import { store } from '../store';

export function getWordsProperty(words) {
  const { userWords } = store.getState().toolkit;
  userWords.forEach((userWord, userWordIndex) => {
    const index = words.findIndex((word) => word.id === userWord.wordId);
    if (index !== -1) {
      words[index].difficulty = userWords[userWordIndex].difficulty;
      words[index].optional.isLearned = userWords[userWordIndex].optional.isLearned;
      words[index].optional.startDate = userWords[userWordIndex].optional.startDate;
    }
  });
  return words;
}
