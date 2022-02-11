import { getUserWord, updateUserWord, createUserWord } from '../api/users';
import Attempt from '../models/attempt';
import UserWord from '../models/user-word';
import { redirect } from '../services';
import { easyWordLearnedAttempts, hardWordLearnedAttempts } from '../services/settings';
import { getState, isAuthorized } from '../services/state';

function setWordAttempt(word, attempt) {
  if ('optional' in word) {
    word.optional.lastAttemptSuccess = attempt.success;
    word.optional.lastAttemptDate = attempt.date;
    if (attempt.success) {
      word.optional.successAttempts += 1;
      if (
        word.optional.successAttempts >= hardWordLearnedAttempts ||
        (word.difficulty === 'easy' && word.optional.successAttempts >= easyWordLearnedAttempts)
      ) {
        word.optional.isLearned = true;
        word.difficulty = 'easy';
      }
    } else {
      word.optional.failedAttempts += 1;
      word.optional.isLearned = false;
    }
  } else {
    const newWord = new UserWord(word.wordId, word.difficulty);
    return setWordAttempt(newWord, attempt);
  }
  return word;
}

export async function createWordController(wordId) {
  let word;
  if (isAuthorized()) {
    const state = getState();
    const { userId } = state;
    word = new UserWord(wordId);
    const response = await createUserWord(userId, wordId, word);
    if (response.success) {
      word.id = response.content.id;
      return word;
    }
  } else {
    redirect('#/login');
  }
  return word;
}

export async function createUpdateWordAttempt(wordId, isSuccessAttempt) {
  const attempt = new Attempt(isSuccessAttempt);
  let updatedWord;
  if (isAuthorized()) {
    const state = getState();
    const { userId } = state;
    const response = await getUserWord({ userId, wordId });

    // word already exist, need add new attempt
    let word;
    if (response.success) {
      word = response.content;
    } else {
      word = await createWordController(wordId);
    }

    word = setWordAttempt(word, attempt);
    updatedWord = await updateUserWord(userId, wordId, word);
    return updatedWord.content;
  }
  redirect('#/login');
  return updatedWord;
}
