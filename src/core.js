import {List,Map} from 'immutable';
export const INITIAL_STATE = Map();


export const setEntries = (state,entries) => {
  return state.set('entries',List(entries));
}

const getWinners = (state) => {
  if(!state.get('vote')) return List.of();
  const entry1 = state.get('vote').get('pair').first();
  const entry2 = state.get('vote').get('pair').last();
  const count1 = state.get('vote').get('tally').get(entry1);
  const count2 = state.get('vote').get('tally').get(entry2);
  if(count1>count2){
    return List.of(entry1);
  }
  if(count1<count2){
    return List.of(entry2);
  }
  if(count1==count2){
    return List.of(entry1,entry2);
  }

}

export const next = (state) => {
  const entries = state.get('entries').concat(getWinners(state));
  if (entries.size===1){
    return state.remove('vote')
                .remove('entries')
                .set('winner', entries.first());
  } else {
    return state.merge({
      entries: entries.skip(2),
      vote: Map({
        pair: state.get('entries').take(2)
      })
    });
  }
}

export const vote = (state,vote) => {
  return state.updateIn(
    ['tally', vote],
    0,
    tally => tally + 1
  );
}
