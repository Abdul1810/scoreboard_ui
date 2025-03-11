import Ember from 'ember';

export default Ember.Controller.extend({
    team1_balls: [],
    team2_balls: [],
    team1_players: [],
    team2_players: [],
    team1: "",
    team2: "",
    resultMessage: "",
    
    seekTo(position) {
        let videoElement = Ember.$('#highlight-vdo')[0];
        if (videoElement) {
            videoElement.currentTime = position;
        } else {
            console.log('Video element not found');
        }
    },

    actions: {
        viewPlayerHighlights(teamId, playerId) {
            let sum = 0;
            if (teamId === "team1") {
                for (let i = 0; i < playerId; i++) {
                    sum += this.get('team1_balls')[i];
                }
                this.set('resultMessage', `Viewing ${this.get('team1_players')[playerId]} highlights`);
            } else {
                for (let i = 0; i < this.get('team1_balls').length; i++) {
                    sum += this.get('team1_balls')[i];
                }
                for (let i = 0; i < playerId; i++) {
                    sum += this.get('team2_balls')[i];
                }
                this.set('resultMessage', `Viewing ${this.get('team2_players')[playerId]} highlights`);
            }
            console.log(`before Player ${playerId} from ${teamId} ${sum} balls played so time is ${sum * 5}`);
            this.seekTo(sum * 5);
        }
    }
});
