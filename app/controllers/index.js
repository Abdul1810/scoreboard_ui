import Ember from 'ember';

export default Ember.Controller.extend({
    matches: [],
    socket: null,

    initWebSocket() {
        const socket = new WebSocket(`ws://localhost:8080/ws/matches`);
        this.set('socket', socket);
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.set('matches', data);
        };
    },

    disconnectWebSocket() {
        const socket = this.get('socket');
        if (socket !== null) {
            socket.close();
        }
    }
});
