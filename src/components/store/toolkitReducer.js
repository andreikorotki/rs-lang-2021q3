import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  group: 1,
  page: 1,
  words: [],
  learnedPages: [],
  userWords: [],
  isStartGameFromMenu: true,
  isLogin: false
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
      if (state.page > 30) {
        state.page = 30;
      }
    },
    setGroup(state, action) {
      state.group = +action.payload;
    },
    setWords(state, action) {
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
      console.log(action.payload, index);
    },
    addLearnedPages(state, action) {
      state.learnedPages.push(action.payload);
    },
    setGameStartFromMenu(state, action) {
      state.isStartGameFromMenu = action.payload;
    },
    setAuthorized(state, action) {
      state.isLogin = action.payload;
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
  addLearnedPages,
  setGameStartFromMenu,
  setAuthorized
} = toolkitReducer.actions;
