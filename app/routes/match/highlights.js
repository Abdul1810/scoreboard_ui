import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        return new Ember.RSVP.Promise((resolve) => {
            Ember.$.ajax({
                url: `http://localhost:8080/api/highlights?id=${params.match_id}`,
                type: 'GET',
                dataType: 'json'
            })
                .done((data) => resolve(data))
                .fail((error) => {
                    resolve({ error: true, message: error.responseJSON && error.responseJSON.message });
                });
        });
    },
    setupController(controller, model) {
        this._super(...arguments);
        controller.setProperties({
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
        if (model.error) {
            window.history.back();
        } else {
            controller.set('team1_players', model.team1_players);
            controller.set('team2_players', model.team2_players);
            controller.set('team1', model.team1);
            controller.set('team2', model.team2);
            controller.set('timestamps', model.timestamps);
            controller.set('highlights_path', encodeURIComponent(model.highlights_path));
        }
        Ember.run.scheduleOnce('afterRender', this, () => {
            let videoElement = Ember.$('#highlight-vdo')[0];
            if (videoElement) {
                videoElement.addEventListener('loadedmetadata', () => {
                    controller.set('videoLength', videoElement.duration);
                    controller.set('totalTime', videoElement.duration);
                });
                videoElement.addEventListener('timeupdate', () => {
                    const time = Math.floor(videoElement.currentTime);
                    if (time >= controller.get('totalTime')) {
                        controller.set('isPlaying', false);
                        videoElement.pause();
                    }
                    controller.set('currentTime', time);
                    let player = controller.get('timestamps')[time];
                    if (player) {
                        controller.set('resultMessage', `${player} got out`);
                    }
                });
            } else {
                console.log('Video element not found');
            }
        });
    }
});
