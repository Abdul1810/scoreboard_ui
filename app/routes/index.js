import Ember from 'ember';

export default Ember.Route.extend({
    setupController(controller, model) {
        this._super(controller, model);
        controller.initWebSocket();
    },

    actions: {
        willTransition() {
            this.controllerFor('index').disconnectWebSocket();
            return true;
        }
    }
});
