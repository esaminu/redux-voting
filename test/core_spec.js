import {setEntries,next,vote} from '../src/core';
import {expect} from 'chai';
import {List,Map} from 'immutable';
import {reducer} from '../src/reducer';
import {makeStore} from '../src/store';

describe("application logic", () => {
  describe("setEntries",() => {
    it("loads entries into state", () => {
      const state = Map();
      const entries = List.of("Trainspotting","The Usual Suspects","Silence of the Lambs");
      const nextState = setEntries(state,entries);
      expect(nextState).to.deep.equal(Map({
        entries: List.of("Trainspotting","The Usual Suspects","Silence of the Lambs")
      }));
    });

    it("converts to immutable", () => {
      const state = Map();
      const entries = ["Trainspotting","The Usual Suspects","Silence of the Lambs"];
      const nextState = setEntries(state,entries);
      expect(nextState).to.equal(Map({
        entries: List.of("Trainspotting","The Usual Suspects","Silence of the Lambs")
      }));
    });
  });

  describe("next", () => {
    it("takes the next two entries to vote", () => {
      const state = Map({
        entries: List.of("Trainspotting","The Usual Suspects","Silence of the Lambs")
      });
      const nextState = Map({
        entries: List.of("Silence of the Lambs"),
        vote: Map({
          pair: List.of("Trainspotting","The Usual Suspects")
        })
      });
      expect(nextState).to.equal(next(state));
    });

    it("puts winner of current vote back to entries",() => {
      const state = Map({
        entries: List.of("Silence of the Lambs","Inception","The Prestige"),
        vote: Map({
          pair: List.of("Trainspotting","The Usual Suspects"),
          tally: Map({
            'Trainspotting': 4,
            'The Usual Suspects':5
          })
        })
      });
      const nextState = Map({
        entries: List.of("The Prestige","The Usual Suspects"),
        vote: Map({
          pair: List.of("Silence of the Lambs","Inception")
        })
      });
      expect(nextState).to.equal(next(state));
    });

    it("puts both tied winners back to entries",() => {
      const state = Map({
        entries: List.of("Silence of the Lambs","Inception","The Prestige"),
        vote: Map({
          pair: List.of("Trainspotting","The Usual Suspects"),
          tally: Map({
            'Trainspotting': 5,
            'The Usual Suspects':5
          })
        })
      });
      const nextState = Map({
        entries: List.of("The Prestige","Trainspotting","The Usual Suspects"),
        vote: Map({
          pair: List.of("Silence of the Lambs","Inception")
        })
      });
      expect(nextState).to.equal(next(state));
    });

    it("marks the winner when there is one entry left",() => {
       const state = Map({
         entries: List(),
         vote: Map({
           pair: List.of("Silence of the Lambs","Inception"),
           tally: Map({
             'Silence of the Lambs': 3,
             'Inception':4
           })
         })
       });
       const nextState = Map({
         winner: 'Inception'
       });
       expect(nextState).to.equal(next(state));
     });
  });

  describe("vote",() => {
    it("creates a tally for voting", () => {
      const state = Map({
          pair: List.of("Trainspotting","The Usual Suspects")
      });
      const nextState = Map({
          pair: List.of("Trainspotting","The Usual Suspects"),
          tally: Map({'Trainspotting': 1})
      });
      expect(nextState).to.equal(vote(state,'Trainspotting'));
    });

    it("Increments the tally if a vote is cast",() => {
      const state = Map({
        pair: List.of("Trainspotting","The Usual Suspects"),
        tally: Map({'Trainspotting': 1,'The Usual Suspects':3})
      });
      const nextState = Map({
        pair: List.of("Trainspotting","The Usual Suspects"),
        tally: Map({'Trainspotting': 2,'The Usual Suspects':3})
      });
      expect(nextState).to.equal(vote(state,'Trainspotting'));
    });
  });

  describe("reducer", () => {
    it("handles setEntries", () => {
      const initialState = Map();
      const action = {type:'SET_ENTRIES', entries: ['Trainspotting']};
      const nextState = Map({
        entries: List.of('Trainspotting')
      });
      expect(nextState).to.equal(reducer(initialState,action));
    });
    it("handles next", () => {
      const initialState = Map({
        entries: List.of('Trainspotting','The Usual Suspects','Silence of the Lambs')
      });
      const nextState = Map({
        entries: List.of('Silence of the Lambs'),
        vote: Map({
          pair: List.of('Trainspotting', 'The Usual Suspects')
        })
      });
      const action = {type:'next'};
      expect(nextState).to.equal(reducer(initialState, action));
    });
    it("handles vote", ()=>{
      const initialState = Map({
        entries: List.of('Silence of the Lambs'),
        vote: Map({
          pair: List.of('Trainspotting', 'The Usual Suspects')
        })
      });
      const nextState = Map({
        entries: List.of('Silence of the Lambs'),
        vote: Map({
          pair: List.of('Trainspotting', 'The Usual Suspects'),
          tally: Map({
            'Trainspotting':1
          })
        })
      });
      const action = {type:'vote',vote:'Trainspotting'};
      expect(nextState).to.equal(reducer(initialState,action));
    });
    it('has an initial state', () => {
      const action = {type: 'SET_ENTRIES', entries: ['Trainspotting']};
      const nextState = reducer(undefined, action);
      expect(nextState).to.equal(Map({
        entries: List.of('Trainspotting')
      }));
    });
  });

  describe('store', ()=> {
    it('is a redux store configured with the correct reducer',()=>{
      const store = makeStore();
      expect(store.getState()).to.equal(Map());
      store.dispatch({
        type:'SET_ENTRIES',
        entries:List.of("Silence of the Lambs")
      });
      expect(store.getState()).to.equal(Map({
        entries:List.of("Silence of the Lambs")
      }));
    });
  });
});
