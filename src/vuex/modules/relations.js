import * as types from '../mutation-types';
import {traverseRelation} from '../../utils';

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
  allRelations(state){
    return traverseRelation( state.relationChain );
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
