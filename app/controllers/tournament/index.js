import Ember from 'ember';

export default Ember.Controller.extend({
    tournaments: [],
    actions: {
        deleteTournament(tournamentId) {
            if (confirm("Are you sure you want to delete this tournament?")) {
                let controller = this;

                Ember.$.ajax({
                    url: `http://localhost:8080/api/tournaments?id=${tournamentId}`,
                    type: 'DELETE'
                })
                    .done(function (data) {
                        let tournaments = controller.get('tournaments');
                        let tournament = tournaments.findBy('id', tournamentId);
                        tournaments.removeObject(tournament);
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
});
