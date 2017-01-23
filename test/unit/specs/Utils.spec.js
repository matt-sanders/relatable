import {getFirst, getSecond} from 'src/utils';

describe('Utils', () => {
  it('should get the first chain correctly', () => {
    let relations = [
      [0, 'You!'],
      [1, 'Parent'],
      [2, 'Grand Parent'],
      [3, 'Great Grand Parent'],
      [4, 'Great Great Grand Parent'],
      [-1, 'Child'],
      [-2, 'Grand Child'],
      [-3, 'Great Grand Child'],
      [-4, 'Great Great Grand Child']
    ];
    relations.forEach( rel => {
      expect( getFirst( [ rel[0] ] ) ).to.equal( rel[1] );
    });
  });

  it('should get the second chain correctly', () => {
    let relations = [
      [0,0, 'Sibling'],
      [0,-1, 'Niece/Nephew'],
      [1,0, 'Aunt/Uncle'],
      [1,1, '1 Cousin'],
      [1,2, '1 Cousin 1 removed'],
      [1,3, '1 Cousin 2 removed'],
      [3,1, '1 Cousin 2 removed'],
      [3,2, '2 Cousin 1 removed'],
      [3,3, '3 Cousin'],
      [3,4, '3 Cousin 1 removed'],
      [3,5, '3 Cousin 2 removed']
    ];
    relations.forEach( rel => {
      let label = getSecond([rel[0], rel[1]]);
      //console.log(rel[2], label);
      expect(label).to.equal(rel[2]);
    });
  });
});

