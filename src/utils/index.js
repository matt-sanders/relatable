import numeral from 'numeral';

/**
 * Given a string like 'Great Great Great Grand Parent' should change it to '3rd Great Grand Parent'
 * @arg {str} string
 */
export function countGreat(str){
  //count the greats
  let matches = str.match(/Great/g);
  if ( !matches || matches.length < 3 ) return str;
  let newStr = str.replace(/Great /g, '');
  return numeral(matches.length).format('Oo') + ' Great ' + newStr;
}

/**
 * Given a chain of descendants it should return the first line of descent
 * E.g passing [1] should return 'Parent', [3] -> Great Grand Parent.
 * @arg {chain} array
 */
export function getFirst(chain = [0]){
  // get the first item in the chain
  let depth = chain[0];
  if (depth === 0) return 'You!';
  
  let parts = [ depth > 0 ? 'Child' : 'Parent' ];
  
  // convert to positive for calculating branches
  let positiveDepth = Math.abs(depth);
  if (positiveDepth === 1) return parts[0];
  
  // calculate the grand-ness
  for (let i = 1; i < positiveDepth; i++) {
    parts.unshift(i === 1 ? 'Grand' : 'Great')
  }
  
  return countGreat( parts.join(' ') );
}

/**
 * Given a chain of descendants it will return the second line of descent
 * E.g passing [1,0] -> Sibling, [2,1] 1st cousin once removed.
 * @arg {chain} array
 */
export function getSecond(chain = [0, 0]){
  let first = parseInt(chain[0]);
  let second = parseInt(chain[1]);
  if (first === 0 && second === 0) return 'Sibling';
  let initialLabel = 'Niece/Nephew';
  if (first < 0) {
    initialLabel = second === 0 ? 'Aunt/Uncle' : 'Cousin';
  }
  let parts = [initialLabel];

  //calculate the great, grand etc
  if ( first === 0 || ( first < 0 && second === 0 ) ){
    let positiveDepth = Math.abs( first === 0 ? chain[1] : chain[0]);
    for (let i = 1; i < positiveDepth; i++){
      let grand = (second === 0 && i === 1 || i !== 1 ) ? 'Great' : 'Grand';
      //if ( second == 0 && i === 1 ) grand = 'Great';

      parts.unshift(grand);    
    }
  }  
  // let positiveBranch = Math.abs(this.secondBranch)
  // -1 = parent
  // -1 - 1 == 1st cousin
  // -1 - 2 == 1st cousin once removed
  // -2 - 0 == Great Aunty
  // -2 - 1 == 1st Cousin once removed
  if (second > 0 && first < 0) {
    let positiveFirst = Math.abs(first);
    
    // first cousin etc
    if (second <= positiveFirst) parts.unshift( numeral(second).format('Oo') );
    if (second > positiveFirst) parts.unshift( numeral(positiveFirst).format('Oo') );
    // once removed etc
    if (second !== positiveFirst ){
      let removedMod = (second < positiveFirst) ? positiveFirst - second : second - positiveFirst;
      let removedText;
      switch ( removedMod ){
        case 1:
          removedText = 'once';
          break;
        case 2:
          removedText = 'twice';
          break;
        default:
          removedText = `${removedMod} times`;
          break;
      }
      parts.push(`${removedText} removed`);
    }
  }
  
  return countGreat( parts.join(' ') );
}

/**
* Just a wrapper function for the above
* @arg {chain} array
*/
export function getRelationLabel(chain){
  return chain.length === 1 ? getFirst(chain) : getSecond(chain);
}

/**
 * When given an object should make a deep clone of the whole object
 * @arg {object} object
 */
export function cloneObject(object){
  return JSON.parse( JSON.stringify(object) );
}

/**
 * Given a chain link it should give you the ID of that chain.
 * @arg {chain} object
 */
export function getChainID( chain = { sex: false, distance: [0] }, includeSex = true ){
  let ID = [ ...chain.distance ];
  if ( chain.sex && includeSex ) ID.push( chain.sex );
  return ID.join(',');
}

/**
 * Give a chain of relations it should figure out all the possible combinations of how they are eventually related to you
 * @arg {relationChain} array
 * @arg {chain} object
 * @arg {sexes} object
 * @arg {debug} bool
 */
export function traverseRelation( relationChain, chain = { sex: false, distance: [0] }, sexes = {}, debug = false ){
  if ( debug ) console.log( '--------------------- TRAVERSAL ----------------------' );
  if ( debug ) {
    console.log('relationChain: ', relationChain);
    console.log('chain: ', chain);
    console.log('sexes: ', sexes);
  }
  //the total chain
  let chains = [];
  let addChain = true;

  let distance = chain.distance;
  let singleDistance = distance.length === 1;

  // if we're coming down from 3 for example
  // we want '2', '2,0', '1', '1,0' so get all of those
  if ( singleDistance && distance[0] < 0 ){
    if ( debug ) console.log('==== RUN DOWN ', distance);
    for ( let i = -1; i > distance[0]; i-- ){
      let newChain = cloneObject(relationChain);
      if ( newChain[0] ) newChain[0].distance[ newChain[0].distance.length - 1 ]--;
      let extraChains = traverseRelation( newChain, { sex: chain.sex, distance: [i,0] }, sexes, debug );
      if ( debug ) console.log(extraChains);
      chains.push( ...extraChains );
    }
  }

  // go through each step of the relation chain
  relationChain.some( ( relation, idx ) => {
    if ( debug ) console.log('==== RELATION:', relation );
    
    let relDistance = relation.distance;
    let singleRelDistance = relDistance.length === 1;
    distance[ distance.length - 1 ] += relDistance[0];
    
    if ( debug ) console.log('1: ', distance );

    if ( !singleDistance && distance[1] <= 0 ){
      // check if this is just going up to a parent-sibling ( -1,0 ).
      // if it is we don't want to do any fancy business
      if ( distance[1] === -1 && !singleRelDistance && relDistance[1] === 0 ){
        distance[0]--;
        distance[1] = 0;
        //return but still iterate to the next relation
        return false;
      }

      // set up a new relation chain for us to work on for these branches
      let newChain = cloneObject(relationChain.slice( idx + 1 ));
      if ( !singleRelDistance ) newChain.unshift( { sex: relation.sex, distance: [ relDistance[1] ] } );
      let distanceDupe;

      // if we've gone into the negatives for the child branch
      // we need to move up a parent
      // e.g. -2,-1 becomes -3
      if ( distance[1] < 0 ){
        distanceDupe = cloneObject( distance );
        distanceDupe[0] -= Math.abs(distanceDupe[1]);
        distanceDupe.splice(-1,1);
        if ( !singleRelDistance ) {
          newChain[0].distance[0]--;
          distanceDupe[0]++;
        } else {
          chain.distance = distanceDupe;
          distance = chain.distance;
          singleDistance = distance.length === 1;
        }
      } else {
        //duplicate the chain
        distanceDupe = cloneObject(distance.slice(0, 1));
      }
      //start the modified branch
      if ( newChain.length > 0 ){
        if ( debug ) console.log('==== A: Begin Traverse');
        let extraChains = traverseRelation(newChain, { sex: chain.sex, distance: distanceDupe }, sexes, debug );
        chains.push( ...extraChains );
      }
    }

    if ( !singleRelDistance ){
      // if there is a second link in the relatives chain but we don't have one in our chain, add it in
      if ( distance[0] <= 0 && singleDistance ) {
        distance.push(0);
        singleDistance = false;
      }
      distance[ distance.length - 1 ] += relDistance[1];
    }

    if ( debug ) console.log('2: ', distance);
    
    // apply the sex to this distance
    chain.sex = relation.sex;
    let chainID = getChainID( chain, false );
    if ( chain.sex && !(chainID in sexes) ){
      sexes[ chainID ] = chain.sex;
    }

    // if we are going down the child tree and there are no siblings specified then specify them
    // e.g. say we are at [-2] and the next relation is [1]. That could be [-1] or [-1,0] so continue with both of them
    if ( singleDistance && distance[0] < 0 && singleRelDistance && relDistance[0] > 0 ){
      if ( debug ) console.log('==== B: Begin Traverse');
      let newChain = cloneObject(relationChain.slice( idx + 1 ));
      let extraChains = traverseRelation( newChain, { sex: chain.sex, distance: [ ...distance, 0 ] }, sexes, debug );
      chains.push( ...extraChains );
    }

    // if the sex of this chain is incompatible then break out and don't add it
    if ( ( chainID in sexes ) && chain.sex !== sexes[ chainID ] ) {
      addChain = false;
      return true;
    }
  });

  // if we get to a point in the chain that already exists but has a different sex then don't add it
  // this is to stop things like "My mums mums sons son" this can obviously not be you.
  let chainID = getChainID( chain, false );
  if ( debug ){
    console.log('==== BEFORE PUSH: ');
    console.log(sexes);
    console.log(chain);
    console.log(addChain);
  }
  
  // criteria for acceptance:
  // 1. it's first distance > 0 implying it's a child. In this case the exclusion of sex doesn't really matter. 
  // 2. it's an ancestor of some sort and addChain is true
  // 3. it's chainID isn't in sexes OR it's chainID is in sexes and the sex matches OR there's no sex
  // 4. this is a sibling of an ancestor, in which case the sex is irrelevant
  if (
    ( distance[0] > 0 ) ||
    (
      (distance[0] <= 0 && addChain ) &&
      !( chainID in sexes ) ||
      ( chain.sex && sexes[chainID] === chain.sex ) ||
      !chain.sex
    ) ||
    !singleDistance
  ) chains.push( chain );

  //get only unique chains
  let seenChains = [];
  let finalChains = [];
  
  chains.forEach( singleChain => {
    let chainID = getChainID( singleChain );
    if ( seenChains.indexOf( chainID ) === -1 ){
      seenChains.push( chainID );
      finalChains.push( singleChain );
    }    
  });

  //add our sibling if we are an option
  if ( finalChains.length > 1 ){
    finalChains.some( singleChain => {
      if ( getChainID( singleChain, false ) !== '0' ) return false;
      let sibling = {
        sex: singleChain.sex,
        distance: [0,0]
      };
      let siblingID = getChainID( sibling );
      if ( seenChains.indexOf( siblingID ) < 0 ){
        finalChains.push( sibling );
      }
    });
  }
  if ( debug ) console.log( '---- END TRAVERSE ----' );
  return finalChains;
}

export function oldTraverseRelation(relationChain, chain = [0]){
  // -1 is a parent
  // 0 is a sibling
  // 1 is a child

  let chains = [];

  // if we're coming down from 3 for example
  // we want '2', '2,0', '1', '1,0' so get all of those
  if ( chain.length === 1 && chain[0] < 0 ){
    for ( let i = -1; i > chain[0]; i-- ){
      let newChain = cloneObject(relationChain);
      newChain[0][ newChain[0].length - 1 ]--;
      let extraChains = traverseRelation( newChain, [i,0] );
      chains.push( ...extraChains );
    }
  }
  
  //go through each step in the relation chain
  relationChain.forEach( (relation, idx) => {
    chain[ chain.length - 1 ] += relation[0];

    if ( chain.length === 2 && chain[1] <= 0 ){
      // check if this is just going up to a parent-sibling ( -1,0 ).
      // if it is we don't want to do any fancy business
      if ( chain[1] === -1 && relation.length === 2 && relation[1] === 0 ){
        chain[0]--;
        chain[1] = 0;
        return true;
      }
      
      // set up a new relation chain for us to work on for these branches
      let newChain = cloneObject(relationChain.slice( idx + 1 ));
      if ( relation.length === 2 ) newChain.unshift( [ relation[1] ] );
      let chainDupe;

      // if we've gone into the negatives for the child branch
      // we need to move up a parent
      // e.g. -2,-1 becomes -3
      if ( chain[1] < 0 ){
        chainDupe = cloneObject( chain );
        chainDupe[0] -= Math.abs(chainDupe[1]);
        chainDupe.splice(-1,1);
        if ( relation.length === 2 ) {
          newChain[0][0]--;
          chainDupe[0]++;
        } else {
          chain = chainDupe;
        }
      } else {
        //duplicate the chain
        chainDupe = cloneObject(chain.slice(0, 1));
      }
      //start the modified branch
      if ( newChain.length > 0 ){
        let extraChains = traverseRelation(newChain, chainDupe);
        chains.push( ...extraChains );
      }
    }

    if ( relation.length === 2 ){
      if ( chain[0] <= 0 || chain.length === 2 ){
        if ( chain.length === 1 ) chain.push(0);
      }
      chain[ chain.length - 1 ] += relation[1];
    }
  });

  //add the main chain
  chains.push( chain );
  //if ( chain.length === 1 && chain[0] === 0 ) chains.push( [0, 0] );

  //get only unique chains
  let seenChains = [];
  let finalChains = [];

  chains.forEach( singleChain => {
    let chainID = singleChain.join(',');
    if ( seenChains.indexOf( chainID ) === -1 ){
      seenChains.push( chainID );
      finalChains.push( singleChain );
    }
  });

  //add our sibling if we are an option
  if ( finalChains.length > 1 && seenChains.indexOf( '0' ) > -1 && seenChains.indexOf('0,0') === -1) finalChains.push( [0,0] );
  
  return finalChains;
}
