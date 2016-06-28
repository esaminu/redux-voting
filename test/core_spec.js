import {setEntries,next} from '../src/core';
import {expect} from 'chai';
import {List,Map} from 'immutable';

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
  })
})
});
