import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return {};
    },
    setupController(controller, model) {
        this._super(controller, model);
        controller.set('errorMessage', null);
    }
});
