import {getFirst, getSecond, getRelationLabel, traverseRelation, cloneObject} from 'src/utils';

const firstRelations = [
  [0, 'You!'],
  [-1, 'Parent'],
  [-2, 'Grand Parent'],
  [-3, 'Great Grand Parent'],
  [-4, 'Great Great Grand Parent'],
  [1, 'Child'],
  [2, 'Grand Child'],
  [3, 'Great Grand Child'],
  [4, 'Great Great Grand Child']
];

const secondRelations = [
  [0,0, 'Sibling'],
  [0,1, 'Niece/Nephew'],
  [0,2, 'Grand Niece/Nephew'],
  [0,3, 'Great Grand Niece/Nephew'],
  [0,4, 'Great Great Grand Niece/Nephew'],
  [-1,0, 'Aunt/Uncle'],
  [-2,0, 'Great Aunt/Uncle'],
  [-3,0, 'Great Great Aunt/Uncle'],
  [-4,0, 'Great Great Great Aunt/Uncle'],
  [-1,1, '1 Cousin'],
  [-1,2, '1 Cousin 1 removed'],
  [-1,3, '1 Cousin 2 removed'],
  [-3,1, '1 Cousin 2 removed'],
  [-3,2, '2 Cousin 1 removed'],
  [-3,3, '3 Cousin'],
  [-3,4, '3 Cousin 1 removed'],
  [-3,5, '3 Cousin 2 removed']
];

const relationChains = [
  {
    chain: [ [0] ],
    options: [ '0' ]
  },
  {
    chain: [ [1], [0,0] ],
    options: [ '1' ]
  },
  {
    chain: [ [0,0], [1] ], //brothers, son
    options: [ '0,1' ] // nephew
  },
  {
    chain: [ [-1,1], [-1,1] ], //cousins cousin
    options: [ '0', '0,0', '-1,1' ] //either you, your sibling or your cousin
  },
  {
    chain: [ [-2,1], [-1,2] ],
    options: [ '0', '0,0', '-1,1', '-2,2' ]
  },
  {
    chain: [ [-2,1], [-2,2] ],
    options: [ '-1', '-1,0', '-2,1' ]
  },
  {
    chain: [ [-1], [-2], [0,0], [1] ],
    options: [ '-3,1' ]
  }
];

describe('Utils', () => {
  it('getFirst()', () => {
    firstRelations.forEach( rel => {
      expect( getFirst( [ rel[0] ] ) ).to.equal( rel[1] );
    });
  });

  it('getSecond()', () => {
    secondRelations.forEach( rel => {
      expect( getSecond([rel[0], rel[1]]) ).to.equal(rel[2]);
    });
  });

  it('getRelationLabel()', () => {
    firstRelations.forEach( rel => {
      expect( getRelationLabel( [ rel[0] ] ) ).to.equal( rel[1] );
    });
    secondRelations.forEach( rel => {
      expect( getRelationLabel([rel[0], rel[1]]) ).to.equal(rel[2]);
    });    
  });

  it('cloneObject()', () => {
    let object = {
      foo: 'bar'
    };

    let newObject = cloneObject(object);
    expect(newObject).to.deep.equal(object);
    object.foo = 'test';
    expect(newObject.foo).to.equal('bar');
  });

  it('traverseRelation()', () => {
    relationChains.forEach( chainObj => {
      let options = traverseRelation( chainObj.chain );
      let mapped = options.map( option => {
        return option.join(',');
      });
      //console.log(mapped);
      expect( options ).to.be.length( chainObj.options.length );
      chainObj.options.forEach( option => {
        //console.log(option);
        expect( mapped.indexOf( option ) ).to.not.equal(-1);
      });
    });
  });
});

