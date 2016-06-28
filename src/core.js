import {List,Map} from 'immutable';

export const setEntries = (state,entries) => {
  return state.set('entries',List(entries));
}

export const next = (state) => {
  return state.merge({
    entries: state.get('entries').skip(2),
    vote: Map({
      pair: state.get('entries').take(2)
    })
  });
}
