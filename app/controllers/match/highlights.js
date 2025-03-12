import Ember from 'ember';

export default Ember.Controller.extend({
    team1: "",
    team2: "",
    resultMessage: "",
    timestamps: {},
    team1_players: [],
    team2_players: [],
    highlights_path: null,
    videoLength: 0,
    isPlaying: false,
    startTime: 0,
    currentTime: 0,
    totalTime: 0,
    currentViewing: null,
    currentViewingIndex: 0,

    init() {
        this._super(...arguments);
        this.setProperties({
            team1_balls: [],
            team2_balls: [],
            team1_players: [],
            team2_players: [],
            team1: "",
            team2: "",
            timestamps: {},
            highlights_path: null,
            videoLength: 0,
            isPlaying: false,
            startTime: 0,
            currentTime: 0,
            totalTime: 0,
            currentViewing: null,
            currentViewingIndex: 0
        });
    },

    seekTo(position) {
        let videoElement = Ember.$('#highlight-vdo')[0];
        if (videoElement) {
            videoElement.currentTime = position;
            if (videoElement.paused) {
                videoElement.play();
                this.set('isPlaying', true);
            }
        } else {
            console.log('Video element not found');
        }
    },
    actions: {
        togglePlayPause() {
            let videoElement = Ember.$('#highlight-vdo')[0];
            if (videoElement) {
                if (videoElement.paused) {
                    if (videoElement.currentTime < this.get('totalTime')) {
                        videoElement.play();
                        this.set('isPlaying', true);
                    }
                } else {
                    videoElement.pause();
                    this.set('isPlaying', false);
                }
            } else {
                console.log('Video element not found');
            }
        },

        trimPart(teamId, playerIndex) {
            let currPlayerStartTime, nextPlayerStartTime;
            if (teamId === "team1") {
                currPlayerStartTime = this.get('team1_players')[playerIndex].startTime;
                if (playerIndex === this.get('team1_players').length - 1) {
                    nextPlayerStartTime = this.get('team2_players')[0].startTime;
                } else {
                    nextPlayerStartTime = this.get('team1_players')[playerIndex + 1].startTime;
                }
                this.set('currentViewing', `Viewing ${this.get('team1_players')[playerIndex].name}`);
                this.set('currentViewingIndex', playerIndex);
            } else if (teamId === "team2") {
                currPlayerStartTime = this.get('team2_players')[playerIndex].startTime;
                if (playerIndex === this.get('team2_players').length - 1) {
                    let keys = Object.keys(this.get('timestamps'));
                    nextPlayerStartTime = keys[keys.length - 1];
                } else {
                    nextPlayerStartTime = this.get('team2_players')[playerIndex + 1].startTime;
                }
                this.set('currentViewing', `Viewing ${this.get('team2_players')[playerIndex].name}`);
                this.set('currentViewingIndex', playerIndex + 11);
            }
            this.set('startTime', currPlayerStartTime);
            this.set('currentTime', currPlayerStartTime);
            this.set('totalTime', nextPlayerStartTime);
            this.seekTo(currPlayerStartTime);
        },

        viewOriginal() {
            let videoElement = Ember.$('#highlight-vdo')[0];
            if (videoElement) {
                this.set('startTime', 0);
                this.set('totalTime', this.get('videoLength'));
                this.set('currentViewing', null);
                videoElement.play();
                this.set('isPlaying', true);
            }
        },

        previousPlayer() {
            let index = this.get('currentViewingIndex');
            if (index > 0) {
                this.send('trimPart', index < 11 ? 'team1' : 'team2', index < 11 ? index - 1 : index - 11);
            }
        },

        nextPlayer() {
            let index = this.get('currentViewingIndex');
            if (index < 21) {
                this.send('trimPart', index < 11 ? 'team1' : 'team2', index < 11 ? index + 1 : index - 11);
            }
        },

        seekVideo(time) {
            this.seekTo(time);
        }
    }
});
