import * as types from '../mutation-types';

const state = {
  relationChain: []
};

const actions = {
  addToChain({commit}, relation){
    commit(types.ADD_TO_CHAIN,relation);
  },
  removeFromChain({commit}, index){
    commit(types.REMOVE_FROM_CHAIN, index);
  }
};

const getters = {
  chainTotal(state){
    let total = [0];
    state.relationChain.forEach( chain => {
      total[0] += chain[0];
      if ( chain.length === 2 ){
        if ( total.length === 1 ) total[1] = 0;
        total[1] += chain[1];
      }
    });
    return total;
  }
};

const mutations = {
  [types.ADD_TO_CHAIN](state, relation){
    state.relationChain.push(relation);
  },
  [types.REMOVE_FROM_CHAIN](state, index){
    state.relationChain.splice(index, 1);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
