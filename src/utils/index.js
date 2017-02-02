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
  
  return parts.join(' ')
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
    if (second <= positiveFirst) parts.unshift(second);
    if (second > positiveFirst) parts.unshift(positiveFirst);
    // once removed etc
    if (second < positiveFirst) parts.push(`${positiveFirst - second} removed`);
    if (second > positiveFirst) parts.push(`${second - positiveFirst} removed`);
  }
  
  return parts.join(' ');
}

/**
* Just a wrapper function for the above
* @arg {chain} array
*/
export function getRelationLabel(chain){
  return chain.length === 1 ? getFirst(chain) : getSecond(chain);
}

export function traverseRelation(relationChain){
  // -1 is a parent
  // 0 is a sibling
  // 1 is a child
    
}
