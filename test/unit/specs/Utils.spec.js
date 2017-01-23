import {getFirst, getSecond, getRelationLabel} from 'src/utils';

let firstRelations = [
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

let secondRelations = [
  [0,0, 'Sibling'],
  [0,-1, 'Niece/Nephew'],
  [0, -2, 'Grand Niece/Nephew'],
  [0, -3, 'Great Grand Niece/Nephew'],
  [0, -4, 'Great Great Grand Niece/Nephew'],
  [1,0, 'Aunt/Uncle'],
  [2,0, 'Great Aunt/Uncle'],
  [3,0, 'Great Grand Aunt/Uncle'],
  [4,0, 'Great Great Grand Aunt/Uncle'],
  [1,1, '1 Cousin'],
  [1,2, '1 Cousin 1 removed'],
  [1,3, '1 Cousin 2 removed'],
  [3,1, '1 Cousin 2 removed'],
  [3,2, '2 Cousin 1 removed'],
  [3,3, '3 Cousin'],
  [3,4, '3 Cousin 1 removed'],
  [3,5, '3 Cousin 2 removed']
];

describe('Utils', () => {
  it('should get the first chain correctly', () => {
    firstRelations.forEach( rel => {
      expect( getFirst( [ rel[0] ] ) ).to.equal( rel[1] );
    });
  });

  it('should get the second chain correctly', () => {
    secondRelations.forEach( rel => {
      expect( getSecond([rel[0], rel[1]]) ).to.equal(rel[2]);
    });
  });

  it('should get both correctly', () => {
    firstRelations.forEach( rel => {
      expect( getRelationLabel( [ rel[0] ] ) ).to.equal( rel[1] );
    });
    secondRelations.forEach( rel => {
      expect( getRelationLabel([rel[0], rel[1]]) ).to.equal(rel[2]);
    });    
  });
});

