import Ember from 'ember';

export default Ember.Controller.extend({
    tournamentId: "",
    teams: Ember.A([]),
    resultMessage: "",
    resultColor: "blue",
    actions: {
        getPlayerRuns(playerId) {
            const tournamentId = this.get('tournamentId');
            Ember.$.ajax({
                url: `http://localhost:8080/api/tournaments/total-score?id=${tournamentId}&player_id=${playerId}`,
                type: 'GET',
                dataType: 'json'
            })
                .done((data) => {
                    this.set('resultMessage', `${data.player_name} stats in ${data.tournament_name}<br>Runs: ${data.total_runs}, Balls: ${data.total_balls}<br>Matches played: ${data.matches_played}`);
                    this.set('resultColor', 'blue');
                })
                .fail((error) => {
                    this.set('resultMessage', error.responseJSON && error.responseJSON.message);
                    this.set('resultColor', 'red');
                });
        },
        getPlayerWickets(playerId) {
            // /api/tournaments/total-wickets?id=1&player_id=1
            // {"balls_bowled":18,"team_id":1,"matches_bowled":3,"player":"Abdul","total_wickets":17}
            const tournamentId = this.get('tournamentId');
            Ember.$.ajax({
                url: `http://localhost:8080/api/tournaments/total-wickets?id=${tournamentId}&player_id=${playerId}`,
                type: 'GET',
                dataType: 'json'
            })
                .done((data) => {
                    this.set('resultMessage', `${data.player} stats in ${data.tournament_name}<br>Wickets: ${data.total_wickets}, Balls: ${data.balls_bowled}<br>Matches played: ${data.matches_bowled}`);
                    this.set('resultColor', 'blue');
                })
                .fail((error) => {
                    this.set('resultMessage', error.responseJSON && error.responseJSON.message);
                    this.set('resultColor', 'red');
                });
        },
    }
});
