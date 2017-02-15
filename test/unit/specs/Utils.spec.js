import {getFirst, getSecond, getRelationLabel, traverseRelation, cloneObject, countGreat, getChainID} from 'src/utils';

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
  [-4,0, '3rd Great Aunt/Uncle'],
  [-1,1, '1st Cousin'],
  [-1,2, '1st Cousin once removed'],
  [-1,3, '1st Cousin twice removed'],
  [-3,1, '1st Cousin twice removed'],
  [-3,2, '2nd Cousin once removed'],
  [-3,3, '3rd Cousin'],
  [-3,4, '3rd Cousin once removed'],
  [-3,5, '3rd Cousin twice removed'],
  [-1,4, '1st Cousin 3 times removed']
];

/*
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
    chain: [ [-1,1], [-2] ],
    options: [ '-2' ]
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
  },
  {
    chain: [ [-1], [-1,0], [-1,0], [-1,0] ],
    options: [ '-4,0' ]
  },
  {
    chain: [ [2], [-1, 1] ],
    options: [ '2' ]
  },
  {
    chain: [ [1], [-1, 1] ],
    options: [ '0,1' ]
  }
];
*/

const relationChains = [
  {
    //me
    chain: [
      {
        sex: false,
        distance: [0]
      }
    ],
    options: [ '0' ]
  },
  {
    //mum
    chain: [
      {
        sex: 'f',
        distance: [-1]
      }
    ],
    options: [ '-1,f' ]
  },
  {
    //childs sibling
    chain: [
      {
        sex: false,
        distance: [1]
      },
      {
        sex: false,
        distance: [0,0]
      }
    ],
    options: ['1']
  },
  {
    //sons sister
    chain: [
      {
        sex: 'm',
        distance: [1]
      },
      {
        sex: 'f',
        distance: [0,0]
      }
    ],
    options: ['1,f']
  },
  {
    //mums, mums, daughter
    chain: [
      {
        sex: 'f',
        distance: [-1]
      },
      {
        sex: 'f',
        distance: [-1]
      },
      {
        sex: 'f',
        distance: [1]
      }
    ],
    options: [ '-1,f', '-1,0,f' ]
  },
  {
    //mums, mums, sons, child
    chain: [
      {
        sex: 'f',
        distance: [-1]
      },
      {
        sex: 'f',
        distance: [-1]
      },
      {
        sex: 'm',
        distance: [1]
      },
      {
        sex: false,
        distance: [1]
      }
    ],
    options: [ '-1,1' ]
  },
  {
    //siblings child
    chain: [
      {
        sex: false,
        distance: [0,0]
      },
      {
        sex: false,
        distance: [1]
      }
    ],
    options: ['0,1']
  },
  {
    //cousins cousin
    chain: [
      {
        sex: false,
        distance: [-1,1]
      },
      {
        sex: false,
        distance: [-1,1]
      }
    ],
    options: ['0', '0,0', '-1,1' ]
  },
  {
    //cousins(M) cousin(F)
    chain: [
      {
        sex: 'm',
        distance: [-1,1]
      },
      {
        sex: 'f',
        distance: [-1,1]
      }
    ],
    options: ['0,f', '0,0,f', '-1,1,f' ]
  },
  {
    //cousins grandparent
    chain: [
      {
        sex: false,
        distance: [-1,1]
      },
      {
        sex: false,
        distance: [-2]
      }
    ],
    options: [ '-2' ]
  },
  {
    //cousins grandparent(M)
    chain: [
      {
        sex: false,
        distance: [-1,1]
      },
      {
        sex: 'm',
        distance: [-2]
      }
    ],
    options: [ '-2,m' ]
  },
  {
    //grandparents nephew, 1st cuz 1nce removed
    chain: [
      {
        sex: false,
        distance: [-2,1]
      },
      {
        sex: false,
        distance: [-1,2]
      }
    ],
    options: [ '0', '0,0', '-1,1', '-2,2' ]
  },
  {
    //grandparents nephew(M), 1st cuz 1nce removed
    chain: [
      {
        sex: 'm',
        distance: [-2,1]
      },
      {
        sex: false,
        distance: [-1,2]
      }
    ],
    options: [ '0', '0,0', '-1,1', '-2,2' ]
  },
  {
    //grandparents nephew, 2nd cousin
    chain: [
      {
        sex: false,
        distance:[-2,1]
      },
      {
        sex: false,
        distance: [-2,2]
      }
    ],
    options: [ '-1', '-1,0', '-2,1' ]
  },
  {
    //parents, grandparents, siblings, child
    chain: [
      {
        sex: false,
        distance: [-1]
      },
      {
        sex: false,
        distance: [-2]
      },
      {
        sex: false,
        distance: [0,0]
      },
      {
        sex: false,
        distance: [1]
      }
    ],
    options: [ '-3,1' ]
  },
  {
    //Mums, grandmother, brothers, son
    chain: [
      {
        sex: 'f',
        distance: [-1]
      },
      {
        sex: 'f',
        distance: [-2]
      },
      {
        sex: 'm',
        distance: [0,0]
      },
      {
        sex: 'm',
        distance: [1]
      }
    ],
    options: [ '-3,1,m' ]
  },
  {
    //parents, aunty/uncle, aunty/uncle, aunty/uncle
    chain: [
      {
        sex: false,
        distance: [-1]
      },
      {
        sex: false,
        distance: [-1,0]
      },
      {
        sex: false,
        distance: [-1,0]
      },
      {
        sex: false,
        distance: [-1,0]
      }
    ],
    options: [ '-4,0' ]
  },
  {
    //fathers, aunty, uncle, aunty
    chain: [
      {
        sex: 'm',
        distance: [-1]
      },
      {
        sex: 'f',
        distance: [-1,0]
      },
      {
        sex: 'm',
        distance: [-1,0]
      },
      {
        sex: 'f',
        distance: [-1,0]
      }
    ],
    options: [ '-4,0,f' ]
  },
  {
    //grandchilds cousin
    chain: [
      {
        sex: false,
        distance: [2]
      },
      {
        sex: false,
        distance: [-1, 1]
      }
    ],
    options: [ '2' ]
  },
  {
    //grandsons cousin
    chain: [
      {
        sex: 'm',
        distance: [2]
      },
      {
        sex: false,
        distance: [-1, 1]
      }
    ],
    options: [ '2' ]
  },
  {
    //childs cousin
    chain: [
      {
        sex: false,
        distance: [1]
      },
      {
        sex: false,
        distance: [-1, 1]
      }
    ],
    options: [ '0,1' ]
  },    
  {
    //daughters cousin
    chain: [
      {
        sex: 'f',
        distance: [1]
      },
      {
        sex: false,
        distance: [-1, 1]
      }
    ],
    options: [ '0,1' ]
  }
];

const countGreats = [
  ['Great Great Grand Parent', 'Great Great Grand Parent'],
  ['Great Great Great Grand Parent', '3rd Great Grand Parent'],
  ['Great Great Great Great Aunt', '4th Great Aunt']
];

describe('Utils', () => {
  it('countGreat()', () => {
    countGreats.forEach( great => {
      let newGreat = countGreat( great[0] );
      expect( newGreat ).to.equal( great[1] );
    });
  });
  
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

  it('getChainID()', () => {
    expect( getChainID() ).to.equal('0');
    expect( getChainID( {sex: 'm', distance: [0,1] } ) ).to.equal('0,1,m');
    expect( getChainID( {sex: 'm', distance: [0,1] }, false ) ).to.equal('0,1');
  });

  it('traverseRelation()', () => {
    relationChains.forEach( ( chainObj, idx ) => {
      console.log("\n\n", idx+'-----------------------------------------------');
      let options = traverseRelation( chainObj.chain, { sex: false, distance: [0] }, {}, true );
      console.log('----');
      let mapped = options.map( option => {
        return getChainID( option );
      });
      console.log('options are: ',chainObj.options);
      console.log('====MAPPED====', mapped);
      expect( options ).to.be.length( chainObj.options.length );
      chainObj.options.forEach( option => {
        //console.log(option);
        expect( mapped.indexOf( option ) ).to.not.equal(-1);
      });
    });
  });
});

