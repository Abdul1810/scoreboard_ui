import Ember from 'ember';

export function removeElm(params) {
  let element = params[1];
  return params[0].filter(function(item){
    return item !== element;
  });
}

export default Ember.Helper.helper(removeElm);