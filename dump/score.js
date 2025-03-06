import Ember from 'ember';

export default Ember.Component.extend({
    queryParams: ['id'],
    socket: null,
    // currentBatting: 'team1',
    // team1Players: [],
    // team2Players: [],
    // reconnectInterval: 3000,

    // didInsertElement() {
    //     this.initWS();
    // },

    // initWS() {
    //     const id = this.paramsFor('score').id;
    //     const socket = new WebSocket(`ws://localhost:8080/ws/stats?id=${id}`);

    //     socket.onopen = () => {
    //         console.log('Connected to the server');
    //         this.set('socket', socket);
    //         this.set('result', 'Live Connected');
    //     };

    //     socket.onmessage = (event) => {
    //         const data = JSON.parse(event.data);
    //         this.updateScoreTable(data);
    //         this.set('currentBatting', data.current_batting || 'team1');
    //         this.set('team1Score', `${data.team1_score}/${data.team2_wickets} (${data.team1_balls})`);
    //         this.set('team2Score', `${data.team2_score}/${data.team1_wickets} (${data.team2_balls})`);

    //         if (data.is_completed === 'false') {
    //             this.handleBatting(data);
    //         } else {
    //             this.handleMatchCompletion(data);
    //         }
    //     };

    //     socket.onclose = () => {
    //         this.set('result', 'Connection closed. Attempting to reconnect...');
    //         Ember.run.later(this, this.initWS, this.reconnectInterval);
    //     };

    //     socket.onerror = () => {
    //         this.set('result', 'Connection error. Attempting to reconnect...');
    //         socket.close();
    //     };
    // },

    // handleBatting(data) {
    //     if (data.current_batting === 'team1') {
    //         this.set('team1StatsBackground', 'aliceblue');
    //         this.set('team2StatsBackground', 'white');
    //         this.set('team1ButtonsDisabled', false);
    //         this.set('team2ButtonsDisabled', true);
    //         this.set('team2OutDisabled', true);
    //         this.set('striker1', `Batting: ${this.get('team1Players')[data.active_batsman_index - 1]}`);
    //         this.set('nonstriker1', `Waiting: ${this.get('team1Players')[data.passive_batsman_index - 1]}`);
    //         this.set('bowler1', `Bowler: ${this.getBowlerName(data.team1_balls)}`);
    //         this.updateWicketsTable(data, this.getBowlerName(data.team1_balls));
    //     } else {
    //         this.set('matchResult', `${this.get('team2Players')[data.active_batsman_index - 1]} is batting\n${this.get('team2Players')[data.passive_batsman_index - 1]} is waiting`);
    //         this.set('team2StatsBackground', 'aliceblue');
    //         this.set('team1StatsBackground', 'white');
    //         this.set('team2ButtonsDisabled', false);
    //         this.set('team1ButtonsDisabled', true);
    //         this.set('team1OutDisabled', true);
    //         this.set('striker2', `Batting: ${this.get('team2Players')[data.active_batsman_index - 1]}`);
    //         this.set('nonstriker2', `Waiting: ${this.get('team2Players')[data.passive_batsman_index - 1]}`);
    //         this.set('bowler2', `Bowler: ${this.getBowlerName(data.team2_balls)}`);
    //         this.updateWicketsTable(data, this.getBowlerName(data.team2_balls));
    //     }
    // },

    // handleMatchCompletion(data) {
    //     if (data.winner === undefined) {
    //         this.set('matchResult', '');
    //         this.disableAllButtons();
    //         return;
    //     }
    //     this.set('matchResult', data.winner !== 'Tie' ? `${data.winner} won the match` : 'Tie');
    //     this.updateWicketsTable(data, '');
    //     if (data.winner === 'team1') {
    //         this.set('team1StatsBackground', 'lightgreen');
    //         this.set('team2StatsBackground', 'white');
    //         if (!this.get('team1').includes('Winner')) {
    //             this.set('team1', this.get('team1') + ' (🎉 Winner)');
    //         }
    //     } else if (data.winner === 'team2') {
    //         this.set('team2StatsBackground', 'lightgreen');
    //         this.set('team1StatsBackground', 'white');
    //         if (!this.get('team2').includes('Winner')) {
    //             this.set('team2', this.get('team2') + ' (🎉 Winner)');
    //         }
    //     } else {
    //         this.set('team1StatsBackground', 'peachpuff');
    //         this.set('team2StatsBackground', 'peachpuff');
    //     }
    //     this.disableAllButtons();
    // },

    // getBowlerName(balls) {
    //     let bowlerIndex;
    //     if (balls === 0) { return this.get('currentBatting') === 'team1' ? this.get('team2Players')[0] : this.get('team1Players')[0]; }
    //     if (balls <= 66) {
    //         let over = Math.floor(balls / 6);
    //         let ball = balls % 6;
    //         bowlerIndex = over + (ball > 0 ? 1 : 0);
    //     } else {
    //         balls -= 66;
    //         let over = Math.floor(balls / 6);
    //         let ball = balls % 6;
    //         bowlerIndex = over + (ball > 0 ? 1 : 0);
    //     }

    //     if (bowlerIndex < 0 || bowlerIndex > 11) {
    //         return 'Bowler';
    //     } else {
    //         return this.get('currentBatting') === 'team1' ? this.get('team2Players')[bowlerIndex - 1] : this.get('team1Players')[bowlerIndex - 1];
    //     }
    // },

    // disableAllButtons() {
    //     this.set('team1ButtonsDisabled', true);
    //     this.set('team2ButtonsDisabled', true);
    // },

    // updateScoreTable(data) {
    //     console.log(data);
    //     // Implementation similar to your updateScoreTable function
    // },

    // updateWicketsTable(data, bowlerName) {
    //     console.log(data, bowlerName);
    //     // Implementation similar to your updateWicketsTable function
    // },

    // actions: {
    //     updateScore(value, team) {
    //         console.log(value, team);
    //         const resultData = { update: value };
    //         this.disableCurrentTeamButtons();
    //         Ember.$.ajax({
    //             url: 'http://localhost:8080/update-stats?id=1',
    //             type: 'PUT',
    //             contentType: 'application/json',
    //             data: JSON.stringify(resultData)
    //         }).then((data) => {
    //             this.set('result', data.message);
    //         });
    //     },

    //     disableCurrentTeamButtons() {
    //         if (this.get('currentBatting') === 'team1') {
    //             this.set('team1ButtonsDisabled', true);
    //             this.set('team1OutDisabled', true);
    //         } else {
    //             this.set('team2ButtonsDisabled', true);
    //             this.set('team2OutDisabled', true);
    //         }
    //     }
    // }
});
