<template>
  <div class="button relation">
    <span class="relation-label">{{label}}</span>
  </div>
</template>

<script>
 import {getRelationLabel} from '../utils';
 export default {
   props: ['chain', 'remove'],
   computed: {
     label(){
       return getRelationLabel( this.chain );
     }
   }
 }
</script>
