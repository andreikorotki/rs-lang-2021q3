import { createSlice } from '@reduxjs/toolkit';
import { BOOK_INITIAL_STATE } from '../constants';

const initialState = {
  group: BOOK_INITIAL_STATE.startGroup,
  page: BOOK_INITIAL_STATE.startPage,
  words: [],
  userWords: [],
  isStartGameFromMenu: true,
  isLogin: false,
  isEndGame: false,
  startLearnedWords: 0,
  endLearnedWords: 0
};

const toolkitReducer = createSlice({
  name: 'toolkit',
  initialState,
  reducers: {
    initial(state) {
      state.page = initialState.page;
    },
    prevPage(state) {
      state.page -= 1;
      if (state.page < 1) {
        state.page = 1;
      }
    },
    nextPage(state) {
      state.page += 1;
      if (state.page > BOOK_INITIAL_STATE.endPage) {
        state.page = BOOK_INITIAL_STATE.endPage;
      }
    },
    setGroup(state, action) {
      state.group = +action.payload;
    },
    setWords(state, action) {
      state.words = action.payload;
    },
    updateWord(state, action) {
      state.words = action.payload;
    },
    setUserWords(state, action) {
      state.userWords = action.payload;
    },
    addUserWords(state, action) {
      state.userWords.push(action.payload);
    },
    updateUserWordProperty(state, action) {
      const index = state.userWords.findIndex((word) => word.wordId === action.payload.wordId);
      state.userWords[index] = action.payload;
    },
    updateWordProperty(state, action) {
      const index = state.words.findIndex(({ id }) => id === action.payload.id);
      state.words[index] = action.payload;
    },
    setGameStartFromMenu(state, action) {
      state.isStartGameFromMenu = action.payload;
    },
    setAuthorized(state, action) {
      state.isLogin = action.payload;
    },
    setEndGame(state, action) {
      state.isEndGame = action.payload;
    },

    setStartLearnedWords(state, action) {
      state.startLearnedWords = action.payload;
    },
    setEndLearnedWords(state, action) {
      state.endLearnedWords = action.payload;
    }
  }
});

export default toolkitReducer.reducer;

export const {
  initial,
  prevPage,
  nextPage,
  setGroup,
  setWords,
  setUserWords,
  addUserWords,
  updateUserWordProperty,
  updateWordProperty,
  setGameStartFromMenu,
  setAuthorized,
  setEndGame,
  setStartLearnedWords,
  setEndLearnedWords
} = toolkitReducer.actions;
