import Ember from 'ember';

export default Ember.Route.extend({
    setupController(controller, model) {
        this._super(controller, model);
        controller.initWebSocket();
        controller.setProperties({
            ongoingMatches: [],
            completedMatches: [],
            resultMessage: "Loading matches...",
            resultColor: "blue",
            socket: null
        });
    }
});
