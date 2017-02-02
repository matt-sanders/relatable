<template>
  <div id="app">
    <h1>Relatable</h1>
    Possible Relations to you
    <relation v-for="relation in allRelations" :chain="relation" :display="true"/>
    <hr/>
    <div class="selectedOptions">
      <relation v-for="link in relationChain" :chain="link" :remove="true" :index="index"/>
    </div>
    <hr/>
    <div class="options">
      <relation v-for="option in options" :chain="option"/>
    </div>
  </div>
</template>

<script>
import Relation from './components/Relation';
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'app',
  data(){
    return {
      options: [
        [1],
        [0,0],
        [1,0],
        [1,1]
      ]
    };
  },
  components: {
    Relation
  },
  computed: {
    ...mapGetters([
      'allRelations'
    ]),
    ...mapState({
      relationChain: state => state.Relations.relationChain
    })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
