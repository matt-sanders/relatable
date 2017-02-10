<template>
  <div id="app">
    <div class="container pt-3 p-5-md text-center" id="calculator-container">
      <div>
        <h3>Add your common relatives</h3>
        <p class="text-center">e.g. If you want to find out how you're related to your mother's cousin's son, add "Parent", "Cousin", "Child" in that order.</p>
        <div class="options text-left text-md-center">
          <relation v-for="option in options" :chain="option"/>
        </div>
        <div class="clearfix"></div>
        <hr class="hidden-md-down"/>
        <div v-if="relationChain.length > 0" class="results">
          <div class="result-chain">
            <h4>
              Your:
              <span class="result-chain-list">
                <relation v-for="(link, index) in relationChain" :chain="link" :remove="true" :index="index" :pluralise="index < relationChain.length - 1"/>
              </span>
            </h4>
          </div>

          <div class="result-labels">
            <h4>
              Is:
              <span v-for="(relation, index) in allRelations">
                <relation :chain="relation" :display="true" class="text-primary" />
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
   #app
   {
     background: #eceeef;
   }
   
   #app .options .btn
   {
     padding: 3px 10px;
     font-size: 0.875rem;
   }

   #app .results h4
   {
     font-size: 1.2rem;
   }

   #app .options
   {
     overflow-y: scroll;
     padding: 5px;
     height: 130px;
   }

   #app .options .btn-group
   {
     background: #fff;
     border-bottom: 1px solid #eceeef;
     padding: 0px 0 10px 0;
     position: relative;
     display: block;
     text-align: left;
   }

   #app .options .btn-group:first-child
   {
     border-top: 1px solid #eceeef;
     padding-top: 10px;
   }

   #app .options .btn-group .btn:first-child
   {
     width: 30px;
     height: 30px;
   }

   #app .btn-group .btn-secondary
   {
     border: none;
     background: none;
     box-shadow: none;
   }

   #app .btn-group .btn:first-child
   {
     border-radius: 50%;
   }

   #app .result-chain-list
   {
     display: block;
   }

   #app .result-chain .btn
   {
     padding: 0 5px;
   }

   #app .result-chain .btn-danger
   {
     width: 15px;
     height: 15px;
     line-height: 15px;
     padding: 0;
   }

   #app .results
   {
     padding: 20px;
     margin-left: -15px;
     margin-right: -15px;
     background: #eceeef;
   }

   #app #calculator-container
   {
     background: #ffffff;
   }
   
 }
</style>
