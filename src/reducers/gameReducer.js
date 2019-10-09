import { ADD_HISTORY, EMPTY_HISTORY, SET_STEP, CHANGE_SORT } from '../actions';

const MAX_ROW = 20;
const MAX_COL = 20;
const initialState = {
  history: [
    {
      squares: new Array(MAX_COL * MAX_ROW).fill(null),
      currentPos: -1
    }
  ],
  stepNumber: 0,
  arrange: 'ASC' // sắp xếp lịch sử trong dropdown tăng dần
};

const game = (state = initialState, action) => {
  switch (action.type) {
    case ADD_HISTORY: {
      return {
        ...state,
        history: state.history
          .slice(0, state.stepNumber + 1)
          .concat([action.item])
      };
    }
    case EMPTY_HISTORY:
      return initialState;
    case SET_STEP:
      return { ...state, stepNumber: action.step };
    case CHANGE_SORT:
      return { ...state, arrange: action.value };
    default:
      return state;
  }
};

export default game;
