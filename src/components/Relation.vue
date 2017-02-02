<template>
  <div class="button relation" @click="handleClick()">
    <span class="relation-label">{{label}}</span>
  </div>
</template>

<script>
 import {getRelationLabel} from '../utils';
 import { mapActions } from 'vuex';
 
 export default {
   props: ['chain', 'remove', 'index'],
   computed: {
     label(){
       return getRelationLabel( this.chain );
     }
   },
   methods: {
     ...mapActions([
       'removeFromChain',
       'addToChain'
     ]),
     handleClick(){
       if ( this.remove === true ){
         this.removeFromChain(this.index);
       } else {
         this.addToChain(this.chain);
       }
     }
   }
 }
</script>
