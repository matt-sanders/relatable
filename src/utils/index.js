/**
 * Given a chain of descendants it should return the first line of descent
 * E.g passing [1] should return 'Parent', [3] -> Great Grand Parent.
 * @arg {chain} array
 */
export function getFirst(chain = [0]){
  // get the first item in the chain
  let depth = chain[0];
  if (depth === 0) return 'You!';
  
  let parts = [ depth > 0 ? 'Parent' : 'Child' ];
  
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
  if (first > 0) {
    initialLabel = second === 0 ? 'Aunt/Uncle' : 'Cousin';
  }
  let parts = [initialLabel];
  // let positiveBranch = Math.abs(this.secondBranch)
  // 1 = parent
  // 1 - 1 == 1st cousin
  // 1 - 2 == 1st cousin once removed
  // 2 - 0 == Great Aunty
  // 2 - 1 == 1st Cousin once removed
  if (second > 0 && first > 0) {
    // first cousin etc
    if (second <= first) parts.unshift(second);
    if (second > first) parts.unshift(first);
    // once removed etc
    if (second < first) parts.push(`${first - second} removed`);
    if (second > first) parts.push(`${second - first} removed`);
  }
  
  /*
     for (let i = 1; i < positiveBranch; i++) {
     if (this.firstBranch === 0) {
     parts.unshift(i === 1 ? 'Grand' : 'Great')
     }
     }
   */
  return parts.join(' ');
}
