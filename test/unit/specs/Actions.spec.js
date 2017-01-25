import Relations from 'src/vuex/modules/relations';

// helper for testing action with expected mutations
const testAction = (action, payload, state, expectedMutations, done) => {
  let count = 0;

  // mock commit
  const commit = (type, payload) => {
    const mutation = expectedMutations[count];
    expect(mutation.type).to.equal(type);
    if (payload) {
      expect(mutation.payload).to.deep.equal(payload);
    }
    count++;
    if (count >= expectedMutations.length) {
      done();
    }
  }

  // call the action with mocked store and arguments
  action({ commit, state }, payload)

    // check if no mutations should have been dispatched
    if (expectedMutations.length === 0) {
      expect(count).to.equal(0)
        done()
    }
}

describe("Actions", () => {
  it('addToChain', done => {
    let chain = [0,0];
    testAction(Relations.actions.addToChain, chain, {}, [
      { type: 'ADD_TO_CHAIN', payload: chain }
    ], done);
  });

  it('removeFromChain', done => {
    Relations.state.relationChain = [
      [0,0],
      [0,0]
    ];
    testAction(Relations.actions.removeFromChain, 1, Relations.state, [
      {type: 'REMOVE_FROM_CHAIN', payload: 1 }
    ], done);
  });
});
