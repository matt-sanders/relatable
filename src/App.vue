<template>
  <div id="app">
    <div class="container p-5 text-center" id="calculator-container">
      <div>
        <h3>Add your common relatives</h3>
        <p class="text-center">e.g. If you want to find out how you're related to your mother's cousin's son, add "Parent", "Cousin", "Child" in that order.</p>
        <relation v-for="option in options" :chain="option"/>
        <hr/>
        <div v-if="relationChain.length > 0">
          <h4>
            Your:
            <relation v-for="(link, index) in relationChain" :chain="link" :remove="true" :index="index" :pluralise="index < relationChain.length - 1"/>
          </h4>
          
          <h4>
            Is:
            <span v-for="(relation, index) in allRelations">
              <relation :chain="relation" :display="true" class="text-success" />
              <small class="text-muted" v-if="index !== allRelations.length - 1"> or </small>
            </span>
          </h4>
        </div>
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
        [2],
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
 html,
 body
 {
   height: 100%;
 }

 #app
 {
   min-height: 100%;
 }
 
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

 #main-content
 {
   padding-bottom: 0;
 }
</style>
