import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  group: 1,
  page: 1,
  words: []
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
    }
  }
});

/* function fetchCount(amount = 1) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data: amount }), 500);
  });
} */

export default toolkitReducer.reducer;

export const { initial, prevPage, nextPage, setGroup, setWords } = toolkitReducer.actions;

/* export const thunk = (amount) => async (dispatch) => {
  const response = await fetchCount(amount);
  dispatch(setData(response.data));
}; */
