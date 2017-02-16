import Relations from 'src/vuex/modules/relations';

describe("Getters", () => {
  it('allRelations', () => {
    const state = {
      relationChain: [
        {
          sex: false,
          distance:[-1,1]
        },
        {
          sex: false,
          distance: [-1,1]
        }
      ]
    };
    const relationChain = Relations.getters.allRelations( state );
    let mapped = relationChain.map( relation => {
      return relation.distance.join(',');
    });

    state.relationChain.forEach( relation => {
      let id = relation.distance.join(',');
      expect( mapped.indexOf( id ) ).to.not.equal(-1);
    });
  });
});
