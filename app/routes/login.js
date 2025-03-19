import Ember from 'ember';

export default Ember.Route.extend({
    queryParams: {
        redirect: {
            refreshModel: true
        }
    },
    model() {
        return {};
    },
    setupController(controller, model) {
        this._super(controller, model);
        controller.set('errorMessage', null);
    }
});
