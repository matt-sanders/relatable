import Vue from 'vue';
import Vuex from 'vuex';
import Relations from './modules/relations';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    Relations
  },
  strict: debug
});
