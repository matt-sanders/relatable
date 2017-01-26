import Relations from 'src/vuex/modules/relations';

describe("Getters", () => {
  it('chainTotal', () => {
    const state = {
      relationChain: [
        [0, 0],
        [2, 3],
        [5],
        [7, 8]
      ]
    };
    const total = Relations.getters.chainTotal( state );
    expect( total ).to.deep.equal( [ 14, 11 ] );
  });
});
