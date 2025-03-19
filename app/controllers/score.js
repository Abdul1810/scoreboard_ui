import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['view'],
  view: "full",
  socket: null,
  current_batting: "team1",
  team1: "",
  team2: "",
  team1Players: Ember.A([]),
  team2Players: Ember.A([]),
  team1Runs: Ember.A([]),
  team2Runs: Ember.A([]),
  team1Balls: Ember.A([]),
  team2Balls: Ember.A([]),
  team1WicketsMap: Ember.A([]),
  team2WicketsMap: Ember.A([]),
  team1Wickets: Ember.A([]),
  team2Wickets: Ember.A([]),
  result: "",
  matchResult: "",
  team1Stats: "",
  team2Stats: "",
  team1StatsBackground: "white",
  team2StatsBackground: "white",
  active_batsman_index: 0,
  passive_batsman_index: 0,
  striker1: "",
  striker2: "",
  nonStriker1: "",
  nonStriker2: "",
  bowler1: "",
  bowler2: "",
  reconnectInterval: 3000,
  shouldReconnect: true,
  team1TotalBalls: Ember.A([]),
  team2TotalBalls: Ember.A([]),
  highlightsPath: null,
  is_completed: false,

  initWebSocket(matchId) {
    const socketUrl = `ws://localhost:8080/ws/stats?id=${matchId}`;
    this.set('socket', new WebSocket(socketUrl));
    const socket = this.get('socket');

    socket.onopen = () => {
      console.log('Connected to the server');
      this.set('result', "Live Connected");
      setTimeout(() => {
        this.set('shouldReconnect', true);
      }, this.get('reconnectInterval'));
    };

    socket.onmessage = (event) => {
      if (event.data === "not-found") {
        window.location.reload();
      }
      const data = JSON.parse(event.data);
      console.log(data);
      this.set('team1Stats', `${data.team1_score}/${data.team2_wickets} (${data.team1_balls})`);
      this.set('team2Stats', `${data.team2_score}/${data.team1_wickets} (${data.team2_balls})`);
      this.updateScoreTable(data);
      this.set('is_completed', data.is_completed === "true");
      this.set('current_batting', data.current_batting);
      let team1BallDistribution = distributeBalls(data.team1_balls);
      let team2BallDistribution = distributeBalls(data.team2_balls);

      this.set('team1TotalBalls', Ember.A(team1BallDistribution));
      this.set('team2TotalBalls', Ember.A(team2BallDistribution));

      if (data.is_completed === "false") {
        this.handleMatchInProgress(data);
      } else {
        this.handleMatchCompleted(data);
      }
    };

    function distributeBalls(totalBalls) {
      let ballsArray = [];
      let balls = totalBalls;
      let i = 0;

      while (balls > 0) {
        if (balls >= 6) {
          ballsArray.push(6);
          balls -= 6;
        } else {
          ballsArray.push(balls);
          balls = 0;
        }
        i++;
      }

      while (i < 11) {
        ballsArray.push(0);
        i++;
      }

      return ballsArray;
    }

    socket.onclose = () => {
      this.set('result', "Connection closed. Attempting to reconnect...");
      setTimeout(() => {
        if (this.shouldReconnect) {
          this.initWebSocket(matchId);
        }
      }, this.reconnectInterval);
    };

    socket.onerror = () => {
      this.set('result', "Connection error. Attempting to reconnect...");
      socket.close();
    };
  },

  disconnectWebSocket() {
    const socket = this.get('socket');
    if (socket !== null) {
      socket.close();
    }
  },

  handleMatchInProgress(data) {
    this.setProperties({
      active_batsman_index: data.active_batsman_index,
      passive_batsman_index: data.passive_batsman_index,
    });

    const isTeam1Batting = data.current_batting === "team1";
    const battingTeam = isTeam1Batting ? this.team1Players : this.team2Players;
    const bowlerName = data.active_bowler_index === -1 ? "Selecting Bowler" :
      isTeam1Batting ? this.get('team2Players')[data.active_bowler_index - 1] : this.get('team1Players')[data.active_bowler_index - 1];

    if (data.active_batsman_index === -1 || data.passive_batsman_index === -1) {
      this.set('matchResult', "Selecting batsman");
    } else {
      this.set('matchResult', `${battingTeam[data.active_batsman_index - 1]}
        is batting\n${battingTeam[data.passive_batsman_index - 1]} is waiting`);
    }
    this.setProperties({
      team1StatsBackground: isTeam1Batting ? "aliceblue" : "white",
      team2StatsBackground: isTeam1Batting ? "white" : "aliceblue",
    });

    if (data.current_batting === "team1") {
      if (data.team1_freehits_map.includes((parseInt(data.team1_balls) + 1))) {
        this.set('matchResult', "Free Hit");
      }
    } else if (data.current_batting === "team2") {
      if (data.team2_freehits_map.includes((parseInt(data.team2_balls) + 1))) {
        this.set('matchResult', "Free Hit");
      }
    }
    this.updateWicketsTable(data, bowlerName);
    this.setProperties(isTeam1Batting ? {
      bowler1: `${bowlerName}`,
      striker1: `Batting: ${data.active_batsman_index !== -1 ? battingTeam[data.active_batsman_index - 1] : "Selecting batsman"}`,
      nonStriker1: `Waiting: ${data.passive_batsman_index !== -1 ?
        battingTeam[data.passive_batsman_index - 1] : "Selecting batsman"}`,
      bowler2: "",
      striker2: "",
      nonStriker2: ""
    } : {
      bowler2: `${bowlerName}`,
      striker2: `Batting: ${data.active_batsman_index !== -1
        ? battingTeam[data.active_batsman_index - 1] : "Selecting batsman"}`,
      nonStriker2: `Waiting: ${data.passive_batsman_index !== -1
        ? battingTeam[data.passive_batsman_index - 1] : "Selecting batsman"}`,
      bowler1: "",
      striker1: "",
      nonStriker1: ""
    });
  },

  handleMatchCompleted(data) {
    if (data.winner === undefined) {
      this.set('matchResult', "");
      this.set('team1StatsBackground', "white");
      this.set('team2StatsBackground', "white");
      return;
    }
    this.set('current_batting', "none");
    this.set('matchResult', data.winner !== 'Tie' ? `${data.winner} won the match` : "Tie");
    this.updateWicketsTable(data, "");
    if (data.winner === "team1") {
      this.set('team1StatsBackground', "lightgreen");
      this.set('team2StatsBackground', "white");
      if (!this.get('team1').includes("Winner")) {
        this.set('team1', this.get('team1') + " (🎉 Winner)");
      }
    } else if (data.winner === "team2") {
      this.set('team2StatsBackground', "lightgreen");
      this.set('team1StatsBackground', "white");
      if (!this.get('team2').includes("Winner")) {
        this.set('team2', this.get('team2') + " (🎉 Winner)");
      }
    } else {
      this.set('team1StatsBackground', "peachpuff");
      this.set('team2StatsBackground', "peachpuff");
    }
  },

  updateScoreTable(data) {
    const team1_runs = Object.values(data.team1_runs);
    const team2_runs = Object.values(data.team2_runs);

    this.set('team1Runs', team1_runs);
    this.set('team2Runs', team2_runs);

    this.set('team1Balls', data.team1_balls_map);
    this.set('team2Balls', data.team2_balls_map);

    this.set('team1WicketsMap', data.team1_wickets_map);
    this.set('team2WicketsMap', data.team2_wickets_map);
  },

  updateWicketsTable(data) {
    const team1_outs = Object.values(data.team1_outs);
    const team2_outs = Object.values(data.team2_outs);

    this.set('team1Wickets', team1_outs);
    this.set('team2Wickets', team2_outs);
  },
  actions: {
    openDialog(id) {
      let dialog = document.getElementById(id);
      dialog.showModal();
    },
    closeDialog(id) {
      let dialog = document.getElementById(id);
      dialog.close();
    }, shareBanner() {
      const id = this.get('model.id');
      const imageUrl = `http://localhost:8080/image/banner?id=${id}`;

      if (navigator.canShare && navigator.canShare({ files: [] })) {
        fetch(imageUrl)
          .then(response => response.blob())
          .then(blob => {
            const file = new File([blob], 'banner.jpg', { type: blob.type });
            return navigator.share({
              title: 'Match Banner',
              text: 'Check out this match banner!',
              files: [file]
            });
          })
          .catch(error => {
            console.error('Error sharing:', error);
            alert('Failed to share the banner.');
          });
      } else if (navigator.share) {
        navigator.share({
          title: 'Match Banner',
          text: 'Check out this match banner!',
          url: imageUrl
        })
          .catch(error => {
            console.error('Error sharing link:', error);
            alert('Failed to share the link.');
          });
      } else {
        navigator.clipboard.writeText(`Check out this match banner:\n\n${imageUrl}`)
          .then(() => {
            alert('Sharing not supported — link copied to clipboard!');
          })
          .catch(error => {
            console.error('Error copying link:', error);
            alert(`You can manually share this link: ${imageUrl}`);
          });
      }
    },
    downloadBanner() {
      let url = `http://localhost:8080/image/banner?id=${this.get('model.id')}`;
      let fileName = `match-banner-${this.get('model.id')}.jpg`;

      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.statusText}`);
          }
          return response.blob();
        })
        .then((blob) => {
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = fileName;
          link.click();

          window.URL.revokeObjectURL(blobUrl);
        })
        .catch((error) => {
          console.error('Download failed:', error);
          alert('Failed to download the banner.');
        });
    },
  }
});
