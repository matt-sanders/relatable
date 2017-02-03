<template>
  <div id="app">
    <div class="jumbotron jumbotron-fluid text-center bg-success text-white">
      <div class="container">
        <h1 class="display-4">Relatable</h1>
        <p class="lead">
          The easiest way to figure out who your mum's cousin's best friend's son is...
        </p>
        <hr/>
        <div class="row justify-content-center">
          <div class="col-md-8">
            <p>
              Relatable is a "relation calculator" built with humans in mind. We don't expect you to know who your 1st cousin twice removed is, or who your great aunt Betty's little grand son Joe is to you, or why you care! Just start plugging your relations into our calculator and we'll do the hard work for you.
            </p>
          </div><!-- /col-md-6 -->
        </div><!-- /row -->
      </div><!-- /container -->
    </div><!-- /jumbotron -->
    <div class="container text-center">
      <div>
        <h3>Add your relations</h3>
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
