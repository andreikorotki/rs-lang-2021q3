import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  group: 1,
  page: 1,
  words: [],
  hardWords: [],
  learnedWords: [],
  learnedPages: []
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
    addHardWord(state, action) {
      state.hardWords.push(action.payload);
    },
    addLearnedWord(state, action) {
      state.learnedWords.push(action.payload);
    },
    deleteHardWord(state, action) {
      const index = state.hardWords.findIndex((word) => word.id === action.payload);
      state.hardWords.splice(index, 1);
    },
    addLearnedPages(state, action) {
      state.learnedPages.push(action.payload);
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
  addHardWord,
  addLearnedWord,
  deleteHardWord,
  addLearnedPages
} = toolkitReducer.actions;
