import { getUserWord, updateUserWord, createUserWord } from '../api/users';
import { DIFFICULTIES, WORDS_LEARNED } from '../constants';
import Attempt from '../models/attempt';
import UserWord from '../models/user-word';
import { redirect } from '../services';
import { getState, isAuthorized } from '../services/state';

function setWordAttempt(word, attempt) {
  if (word?.optional) {
    word.optional.lastAttemptSuccess = attempt.success;
    word.optional.lastAttemptDate = attempt.date;
    if (attempt.success) {
      const { attempts } = word.optional;
      const trimmedAttempts = attempts.trim();
      word.optional.successAttempts += 1;
      word.optional.attempts += '1';
      const requiredForLearnedAttempts = '1'.repeat(WORDS_LEARNED[word.difficulty]);
      if (trimmedAttempts.endsWith(requiredForLearnedAttempts)) {
        word.optional.isLearned = true;
        word.difficulty = DIFFICULTIES.easy;
      }
    } else {
      word.optional.attempts += '0';
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
      return { id: response.content.id, ...word };
    }
  } else {
    redirect('#/login');
  }
  return word;
}

export async function calculateUserWord(wordId, isSuccessAttempt) {
  const attempt = new Attempt(isSuccessAttempt);
  let updatedWord;
  let isNew = false;
  let isNewLearned = false;
  if (isAuthorized()) {
    const state = getState();
    const { userId } = state;
    const response = await getUserWord({ userId, wordId });

    // word already exist, need add new attempt
    let word;
    if (response.success) {
      word = response.content;
    } else {
      isNew = true;
      word = await createWordController(wordId);
    }
    const initiallyLearned = word.isLearned;
    word = setWordAttempt(word, attempt);
    const newLearned = word.isLearned;
    if (!initiallyLearned && newLearned) {
      isNewLearned = true;
    }
    updatedWord = await updateUserWord(userId, wordId, word);
    return { word: updatedWord.content, isNew, isNewLearned };
  }
  return { word: updatedWord, isNew, isNewLearned };
}
