<template>
  <div id="app">
    <div class="container pt-3 p-5-md text-center" id="calculator-container">
      <div>
        <h3>Add your common relatives</h3>
        <p class="text-center">e.g. If you want to find out how you're related to your mother's cousin's son, add "Parent", "Cousin", "Child" in that order.</p>
        <div class="options">
          <relation v-for="option in options" :chain="option"/>
        </div>
        <hr/>
        <div v-if="relationChain.length > 0" class="results">
          <div class="result-chain">
            <h4>
              Your:
              <relation v-for="(link, index) in relationChain" :chain="link" :remove="true" :index="index" :pluralise="index < relationChain.length - 1"/>
            </h4>
          </div>

          <div class="result-labels">
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

 @media screen and ( max-width: 768px ){
   #app .options .btn
   {
     padding: 3px 10px;
     font-size: 0.875rem;
   }

   #app .results h4
   {
     font-size: 1.2rem;
   }

 }
</style>
