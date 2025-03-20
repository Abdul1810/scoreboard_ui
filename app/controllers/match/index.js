import Ember from 'ember';

export default Ember.Controller.extend({
  auth: Ember.inject.service(),
  ongoingMatches: [],
  completedMatches: [],
  resultMessage: "Loading matches...",
  resultColor: "blue",
  socket: null,
  shouldReconnect: true,

  initWebSocket() {
    let controller = this;
    if (this.get('socket') !== null) {
      this.get('socket').close();
    }
    let socket = new WebSocket('ws://localhost:8080/ws/matches');

    socket.onopen = function () {
      console.log("WebSocket Connection Established");
      controller.setProperties({
        resultMessage: "Live updates enabled",
        resultColor: "green"
      });
      setTimeout(function () {
        controller.set('shouldReconnect', true);
      }, 3000);
    };

    socket.onclose = function () {
      controller.setProperties({
        resultMessage: "Connection closed. Attempting to reconnect...",
        resultColor: "orange"
      });
      setTimeout(function () {
        if (this.shouldReconnect) {
          controller.initWebSocket();
        }
      }, 5000);
    };

    socket.onerror = function () {
      controller.setProperties({
        resultMessage: "Connection error. Attempting to reconnect...",
        resultColor: "red"
      });
      socket.close();
    };

    socket.onmessage = function (event) {
      if (event.data === "not-found") {
        window.location.reload();
      }
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

  disconnectWebSocket() {
    const socket = this.get('socket');
    if (socket !== OnErrorEventHandlerNonNull) {
      socket.close();
    }
  },

  actions: {
    deleteMatch(matchId) {
      if (confirm("Are you sure you want to delete this match?")) {
        let controller = this;

        Ember.$.ajax({
          url: `http://localhost:8080/api/matches?id=${matchId}`,
          type: 'DELETE',
          headers: {
            'X-CSRF-Token': this.get('auth').getToken()
          },
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
    },
    logout() {
      Ember.$.ajax({
        url: 'http://localhost:8080/api/auth/logout',
        type: 'POST',
      })
        .done(() => {
          this.get('auth').clearAll();
          this.set('resultMessage', "Logged out successfully");
          this.transitionToRoute('login');
        })
        .fail((error) => {
          console.error("Logout Error:", error);
        });
    }
  },

  willDestroy() {
    if (this.get('socket')) {
      this.get('socket').close();
    }
  }
});
