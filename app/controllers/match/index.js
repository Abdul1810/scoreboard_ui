import Ember from 'ember';

export default Ember.Controller.extend({
  ongoingMatches: [],
  completedMatches: [],
  resultMessage: "Loading matches...",
  resultColor: "blue",
  socket: null,

  init() {
    this._super(...arguments);
    this.initWebSocket();
  },

  initWebSocket() {
    let controller = this;
    let socket = new WebSocket('ws://localhost:8080/ws/matches');

    socket.onopen = function () {
      console.log("WebSocket Connection Established");
      controller.setProperties({
        resultMessage: "Live updates enabled",
        resultColor: "green"
      });
    };

    socket.onclose = function () {
      controller.setProperties({
        resultMessage: "Connection closed. Attempting to reconnect...",
        resultColor: "orange"
      });
      setTimeout(() => controller.initWebSocket(), 3000); // Auto-reconnect
    };

    socket.onerror = function () {
      controller.setProperties({
        resultMessage: "Connection error. Attempting to reconnect...",
        resultColor: "red"
      });
      socket.close();
    };

    socket.onmessage = function (event) {
      let data = JSON.parse(event.data);
      controller.setProperties({
        ongoingMatches: [],
        completedMatches: []
      });
      data.forEach(match => {
        if (match.is_completed === "true") {
          controller.get('completedMatches').pushObject(match);
        } else {
          controller.get('ongoingMatches').pushObject(match);
        }
      });
    };

    this.set('socket', socket);
  },

  actions: {
    deleteMatch(matchId) {
      if (confirm("Are you sure you want to delete this match?")) {
        let controller = this;

        Ember.$.ajax({
          url: `http://localhost:8080/api/matches?id=${matchId}`,
          type: 'DELETE'
        })
          .done(function (data) {
            controller.setProperties({
              resultMessage: data.message,
              resultColor: "green"
            });
          })
          .fail(function (error) {
            controller.setProperties({
              resultMessage: "Error deleting match",
              resultColor: "red"
            });
            console.error("Delete Error:", error);
          });
      }
    }
  },

  willDestroy() {
    if (this.get('socket')) {
      this.get('socket').close();
    }
  }
});
