export const ADD_HISTORY = 'ADD_HISTORY';
export const EMPTY_HISTORY = 'EMPTY_HISTORY';
export const SET_STEP = 'SET_STEP';
export const CHANGE_SORT = 'CHANGE_SORT';

export const addHistory = item => ({
  type: ADD_HISTORY,
  item
});

export const emptyHistory = () => ({
  type: EMPTY_HISTORY
});

export const setStep = step => ({
  type: SET_STEP,
  step
});

export const changeSort = value => ({
  type: CHANGE_SORT,
  value
});
