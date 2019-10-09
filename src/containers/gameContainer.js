import { connect } from 'react-redux';
import Game from '../components/Game';
import { addHistory, emptyHistory, setStep, changeSort } from '../actions';

const mapStateToProps = state => ({
  game: state.game
});

const mapDispatchToProps = dispatch => ({
  addHistory: item => dispatch(addHistory(item)),
  emptyHistory: step => dispatch(emptyHistory(step)),
  setStep: step => dispatch(setStep(step)),
  changeSort: event => dispatch(changeSort(event))
});

const GameContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);

export default GameContainer;
