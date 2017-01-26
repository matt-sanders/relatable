<template>
  <div class="button relation" :click="handleClick()">
    <span class="relation-label">{{label}}</span>
  </div>
</template>

<script>
 import {getRelationLabel} from '../utils';
 import { mapActions } from 'vuex';
 
 export default {
   props: ['chain', 'remove'],
   computed: {
     label(){
       return getRelationLabel( this.chain );
     }
   },
   methods: {
     ...mapActions([
       'chainTotal'
     ]),
     handleClick(){
       if ( this.remove === true ){
         
       } else {

       }
     }
   }
 }
</script>
