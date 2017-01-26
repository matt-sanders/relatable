import 'es6-promise/auto';
import Vue from 'vue';
import Relation from 'src/components/Relation';

describe('Relation.vue', () => {
  it('should display the correct label', () => {
    const vm = new Vue({
      el: document.createElement('div'),
      render: (h) => h(Relation, {
        props: {
          chain: [0,0]
        }
      })
    });

    expect(vm.$el.querySelector('.relation-label').textContent).to.equal('Sibling');
  });
});
