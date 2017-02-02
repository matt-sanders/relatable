import Relations from 'src/vuex/modules/relations';

describe("Getters", () => {
  it('allRelations', () => {
    const state = {
      relationChain: [
        [-1,1],
        [-1,1]
      ]
    };
    const relationChain = Relations.getters.allRelations( state );
    let mapped = relationChain.map( relation => {
      return relation.join(',');
    });

    state.relationChain.forEach( relation => {
      let id = relation.join(',');
      expect( mapped.indexOf( id ) ).to.not.equal(-1);
    });
  });
});
