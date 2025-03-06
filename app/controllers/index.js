import Ember from 'ember';

export default Ember.Controller.extend({
    matches: [],
    socket: null,

    init() {
        const socket = new WebSocket(`ws://localhost:8080/ws/matches`);
        this.set('socket', socket);
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.set('matches', data);
        };
    },

    willDestroy() {
        this._super(...arguments);
        const socket = this.get('socket');
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.close();
        }
    }
});
