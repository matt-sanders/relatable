import * as types from '../mutation-types';

const state = {
  relationChain: []
};

const actions = {
  addToChain({commit}, relation){
    commit(types.ADD_TO_CHAIN,relation);
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
  actions,
  mutations
};
