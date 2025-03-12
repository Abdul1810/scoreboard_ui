import Ember from 'ember';

export default Ember.Controller.extend({
    team1: "",
    team2: "",
    resultMessage: "",
    timestamps: {},
    team1_players: [],
    team2_players: [],
    highlights_path: null,

    actions: {
        seekTo(position) {
            let videoElement = Ember.$('#highlight-vdo')[0];
            if (videoElement) {
                videoElement.currentTime = position;
                if (videoElement.paused) {
                    videoElement.play();
                }
            } else {
                console.log('Video element not found');
            }
        },
    }
});
