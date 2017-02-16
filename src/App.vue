<template>
  <div id="app">
    <div class="container pt-3 p-5-md text-center" id="calculator-container">
        <div class="row">
          <div class="col-md-12 hidden-md-down">
            <h3>Add your common relatives</h3>
            <p class="text-center">e.g. If you want to find out how you're related to your mother's cousin's son, add "Mother", "Cousin", "Son" in that order.</p>
          </div>
          <div class="col-md-6 options" id="option-container">
            <div class="col-md-12 hidden-md-up">
              <h3>Add your common relatives</h3>
              <p class="text-center">e.g. If you want to find out how you're related to your mother's cousin's son, add "Mother", "Cousin", "Son" in that order.</p>
            </div>
            <div class="list-group">
              <div class="list-group-item" v-for="option in options">
                <div class="d-flex w-100">
                  <h5 class="mb-1">{{option.label}}</h5>
                </div>
                <div class="text-left w-100">
                  <relation v-for="relation in option.relations" :chain="relation"/>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div v-if="relationChain.length > 0" class="results rounded">
              <div class="result-chain">
                <h4>
                  Your:
                  <span class="result-chain-list d-block">
                    <relation v-for="(link, index) in relationChain" :chain="link" :remove="true" :index="index" :pluralise="index < relationChain.length - 1"/>
                  </span>
                </h4>
              </div><!--end result chain-->

              <div class="result-labels">
                <h4>
                  Is:
                  <span v-for="(relation, index) in allRelations">
                    <relation :chain="relation" :display="true" class="text-primary" />
                    <small class="text-muted" v-if="index !== allRelations.length - 1"> or </small>
                  </span>
                </h4>
              </div><!--end result-labels-->
            </div><!--end results-->
          </div><!--end col -->
        </div><!--end row-->        
    </div><!--end container -->
  </div><!--end app-->
</template>

<script>
import Relation from './components/Relation';
import { mapGetters, mapState } from 'vuex';
import Ps from 'perfect-scrollbar';
 
export default {
  name: 'app',
  data(){
    return {
      options: [
        {
          label: 'Parents',
          relations: [
            {
              sex: 'f',
              distance: [-1]
            },
            {
              sex: 'm',
              distance: [-1]
            },
            {
              sex: 'f',
              distance: [-2]
            },
            {
              sex: 'm',
              distance: [-2]
            }
          ]
        },
        {
          label: 'Children',
          relations: [
            {
              sex: 'f',
              distance: [1]
            },
            {
              sex: 'm',
              distance: [1]
            },
            {
              sex: 'f',
              distance: [2]              
            },
            {
              sex: 'm',
              distance: [2]
            }
          ]
        },
        {
          label: 'Siblings',
          relations: [
            {
              sex: 'f',
              distance: [0,0]
            },
            {
              sex: 'm',
              distance: [0,0]
            }
          ]
        },
        {
          label: 'Extended',
          relations: [
            {
              sex: 'f',
              distance: [-1,0]
            },
            {
              sex: 'm',
              distance: [-1,0]
            },
            {
              sex: false,
              distance: [-1,1]
            },
            {
              sex: 'f',
              distance: [0,1]
            },
            {
              sex: 'm',
              distance: [0,1]
            }
          ]
        }
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
  },
  methods: {
    handleResize(){
      Ps.update(this.scrollable);
    }
  },
  mounted(){
    this.scrollable = document.getElementById('option-container');
    Ps.initialize(this.scrollable);

    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy(){
    window.removeEventListener('resize', this.handleResize);
  }
}
</script>

<style lang="scss">
 @import '../node_modules/perfect-scrollbar/src/css/main';
 @import '../node_modules/bootstrap/scss/_variables';
 
 html,
 body
 {
   height: 100%;
 }

 #app
 {
   min-height: 100%;

   .btn,
   .btn-group
   {
     margin: 5px;
   }

   .btn-group
   {
     .btn
     {
       margin: 0;

       i
       {
         font-size: 0.8em;
       }
     }

     &.btn-rounded
     {
       .btn-secondary
       {
         border: none;
         background: none;
         box-shadow: none;
       }

       .btn
       {
         &:first-child
         {
           border-radius: 50%;
         }
       }
     }
   }

   .result-chain
   {
     .btn
     {
       padding: 0 5px;

       &-danger
       {
         width: 15px;
         height: 15px;
         line-height: 15px;
         padding: 0;         
       }
     }
   }

   .results
   {
     padding: 20px;
     margin-left: -15px;
     margin-right: -15px;
     background: $gray-lighter;     
   }
 }

 #main-content
 {
   padding-bottom: 0;
 }

 #option-container
 {
   position: relative;
 }

 @media screen and ( max-width: 768px ){
   #app
   {
     background: $gray-lighter;

     .ps-scrollbar-y-rail
     {
       z-index: 2000;
       opacity: 1;
     }

     .ps-scrollbar-y
     {
       background-color: $brand-primary;
     }

     .options
     {
       padding: 20px;
       height: 300px;
       
       .btn
       {
         padding: 3px 10px;
         font-size: 0.875rem;
       }

       .btn-group
       {
         background: $white;
         border-bottom: 1px solid $gray-lighter;
         padding: 0px 0 10px 0;
         position: relative;
         display: block;
         text-align: left;

         &:first-child
         {
           border-top: 1px solid $gray-lighter;
           padding-top: 10px;
         }

         .btn
         {
           &:first-child
           {
             width: 30px;
             height: 30px;
             padding: 0;
           }
         }
       }
     }

     .results
     {
       h4
       {
         font-size: 1.2rem;
       }
     }

     .btn-group
     {
       &.btn-rounded-md
       {
         .btn-secondary
         {
           border: none;
           background: none;
           box-shadow: none;
         }

         .btn
         {
           &:first-child
           {
             border-radius: 50%;
           }
         }
       }
     }

     #calculator-container
     {
       background: $white;
     }
   }   
 }
</style>
