import {getFirst, getSecond, getRelationLabel, traverseRelation, cloneObject, countGreat, getChainID, sexualise} from 'src/utils';

const debug = true;

const firstRelations = [
  [0, 'You!'],
  [-1, 'Parent'],
  [-2, 'Grandparent'],
  [-3, 'Great Grandparent'],
  [-4, 'Great Great Grandparent'],
  [1, 'Child'],
  [2, 'Grandchild'],
  [3, 'Great Grandchild'],
  [4, 'Great Great Grandchild']
];

const secondRelations = [
  [0,0, 'Sibling'],
  [0,1, 'Niece/Nephew'],
  [0,2, 'Grandniece/nephew'],
  [0,3, 'Great Grandniece/nephew'],
  [0,4, 'Great Great Grandniece/nephew'],
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
    //mothers son
    chain: [
      {
        sex: 'f',
        distance: [-1]
      },
      {
        sex: 'm',
        distance: [1]
      }
    ],
    options: [ '0,m', '0,0,m' ]
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
  },
  {
    //mothers grandaughter
    chain: [
      {
        sex: 'f',
        distance: [-1]
      },
      {
        sex: 'f',
        distance: [2]
      }
    ],
    options: ['1,f', '0,1,f']
  },
  {
    //mothers daughters daughter
    chain: [
      {
        sex: 'f',
        distance: [-1]
      },
      {
        sex: 'f',
        distance: [1]
      },
      {
        sex: 'f',
        distance: [1]
      }
    ],
    options: ['1,f', '0,1,f']
  },
  {
    //mothers childs child
    chain: [
      {
        sex: 'f',
        distance: [-1]
      },
      {
        sex: false,
        distance: [1]
      },
      {
        sex: false,
        distance: [1]
      }
    ],
    options: ['1', '0,1']
  }
];

const countGreats = [
  [ ['Great', 'Great', 'Grand', 'Parent'], 'Great Great Grandparent'],
  [ ['Great', 'Great', 'Great', 'Grand', 'Parent'], '3rd Great Grandparent'],
  [ ['Great', 'Great', 'Great', 'Great', 'Aunt'], '4th Great Aunt']
];

const labels = [
  {
    label: 'Child',
    sex: 'f',
    expect: 'Daughter'
  },
  {
    label: 'Child',
    sex: 'm',
    expect: 'Son'
  },
  {
    label: 'Niece/Nephew',
    sex: 'm',
    expect: 'Nephew'
  },
  {
    label: 'You!',
    sex: false,
    expect: 'You!'
  },
  {
    label: 'You!',
    sex: 'm',
    expect: 'You!'
  },
  {
    label: 'Parent',
    sex: false,
    expect: 'Parent'
  }
];

describe('Utils', () => {
  it('countGreat()', () => {
    countGreats.forEach( great => {
      let newGreat = countGreat( great[0] );
      expect( newGreat ).to.equal( great[1] );
    });
  });

  it('sexualise()', () => {
    labels.forEach( label => {
      expect( sexualise( label.label, label.sex ) ).to.equal( label.expect );
    });
  });
  
  it('getFirst()', () => {
    firstRelations.forEach( rel => {
      let chain = {
        sex: false,
        distance: [ rel[0] ]
      };
      expect( getFirst( chain ) ).to.equal( rel[1] );
    });
  });

  it('getSecond()', () => {
    secondRelations.forEach( rel => {
      let chain = {
        sex: false,
        distance: [ rel[0], rel[1] ]
      };
      expect( getSecond(chain) ).to.equal(rel[2]);
    });
  });

  it('getRelationLabel()', () => {
    firstRelations.forEach( rel => {
      let chain = {
        sex: false,
        distance: [ rel[0] ]
      };
      expect( getRelationLabel( chain ) ).to.equal( rel[1] );
    });
    secondRelations.forEach( rel => {
      let chain = {
        sex: false,
        distance: [ rel[0], rel[1] ]
      };
      expect( getRelationLabel(chain) ).to.equal(rel[2]);
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
      if ( debug ) console.log("\n\n", idx+'-----------------------------------------------');
      let options = traverseRelation( chainObj.chain, { sex: false, distance: [0] }, {}, debug );
      if ( debug ) console.log('----');
      let mapped = options.map( option => {
        return getChainID( option );
      });
      if ( debug ) console.log('options are: ',chainObj.options);
      if ( debug ) console.log('====MAPPED====', mapped);
      expect( options ).to.be.length( chainObj.options.length );
      chainObj.options.forEach( option => {
        //console.log(option);
        expect( mapped.indexOf( option ) ).to.not.equal(-1);
      });
    });
  });
});

