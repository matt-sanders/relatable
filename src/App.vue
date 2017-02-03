<template>
  <div id="app">
    <div class="container">
      <div class="row">
        <div class="col-md-6">First</div>
        <div class="col-md-6">Second</div>
      </div>
    </div>
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
</style>
