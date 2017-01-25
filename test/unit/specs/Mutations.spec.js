import Relations from 'src/vuex/modules/relations';

describe("Mutations", () => {
  describe("Relations", () => {
    it('ADD_TO_CHAIN', () => {
      const state = {
        relationChain: []
      };

      Relations.mutations.ADD_TO_CHAIN(state, [0,0]);
      expect(state.relationChain).to.be.length(1);
      Relations.mutations.ADD_TO_CHAIN(state, [1,4]);
      expect(state.relationChain).to.be.length(2);
      expect(state.relationChain[0]).to.deep.equal([0,0]);
      expect(state.relationChain[1]).to.deep.equal([1,4]);
    });

    it('REMOVE_FROM_CHAIN', () => {
      const state = {
        relationChain: [
          [0,0],
          [0,5],
          [1,4]
        ]
      };

      Relations.mutations.REMOVE_FROM_CHAIN(state, 1);
      expect(state.relationChain).to.be.length(2);
      expect(state.relationChain[0]).to.deep.equal([0,0]);
      expect(state.relationChain[1]).to.deep.equal([1,4]);
    });
  });
});
