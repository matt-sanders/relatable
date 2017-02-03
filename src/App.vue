<template>
  <div id="app">
    <div class="container-fluid text-center bg-success text-white">
      <h1 class="display-3">Relatable</h1>
    </div>
    <div class="container text-center">
      <div>
        <h3>Add your relations</h3>
        <relation v-for="option in options" :chain="option"/>
        <hr/>
        <h4>
          Your:
          <relation v-for="(link, index) in relationChain" :chain="link" :remove="true" :index="index"/>
        </h4>
        
        <h4 v-if="relationChain.length > 0">
          Is:
          <span v-for="(relation, index) in allRelations">
            <relation :chain="relation" :display="true" class="text-success" />
            <small class="text-muted" v-if="index !== allRelations.length - 1"> or </small>
          </span>
        </h4>
      </div>
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
        [-1],
        [-1,0],
        [-2],
        [-1,1]
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
 #app .btn,
 #app .btn-group
 {
   margin: 5px;
 }

 #app .btn-group .btn
 {
   margin: 0;
 }

 #app .btn i
 {
   font-size: 0.8em;
 }
</style>
