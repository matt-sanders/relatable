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
 * Give a chain of relations it should figure out all the possible combinations of how they are eventually related to you
 * @arg {relationChain} array
 * @arg {chain} array
 */
export function traverseRelation(relationChain, chain = [0]){
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
        chain[1] += relation[1];
      }
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
