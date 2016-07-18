import {setEntries,next,vote,INITIAL_STATE} from './core.js'

export const reducer = (state = INITIAL_STATE,action) => {
  switch(action.type) {
    case 'SET_ENTRIES': return setEntries(state,action.entries);
    case 'next': return next(state);
    case 'vote': return state.update('vote', voteState=>vote(voteState,action.vote));
  }
  return state;
}
