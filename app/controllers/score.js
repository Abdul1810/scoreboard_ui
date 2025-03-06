import Ember from 'ember';

export default Ember.Controller.extend({
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

  initWebSocket(matchId) {
    const socketUrl = `ws://localhost:8080/ws/stats?id=${matchId}`;
    this.set('socket', new WebSocket(socketUrl));

    const socket = this.get('socket');

    socket.onopen = () => {
      console.log('Connected to the server');
      this.set('result', "Live Connected");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      this.updateScoreTable(data);
      this.updateWicketsTable(data);
      this.set('current_batting', data.current_batting);
      this.set('team1Stats', `${data.team1_score}/${data.team2_wickets} (${data.team1_balls})`);
      this.set('team2Stats', `${data.team2_score}/${data.team1_wickets} (${data.team2_balls})`);

      if (data.is_completed === "false") {
        this.handleMatchInProgress(data);
      } else {
        this.handleMatchCompleted(data);
      }
    };

    socket.onclose = () => {
      this.set('result', "Connection closed. Attempting to reconnect...");
      setTimeout(() => {
        window.location.reload();
      }, this.reconnectInterval);
    };

    socket.onerror = () => {
      this.set('result', "Connection error. Attempting to reconnect...");
      socket.close();
    };
  },

  handleMatchInProgress(data) {
    this.setProperties({
      active_batsman_index: data.active_batsman_index,
      passive_batsman_index: data.passive_batsman_index,
    });

    const isTeam1Batting = data.current_batting === "team1";
    const battingTeam = isTeam1Batting ? this.team1Players : this.team2Players;
    const bowlerName = this.getBowlerName(isTeam1Batting ? data.team1_balls : data.team2_balls);

    this.setProperties({
      matchResult: `${battingTeam[data.active_batsman_index - 1]} is batting\n${battingTeam[data.passive_batsman_index - 1]} is waiting`,
      team1StatsBackground: isTeam1Batting ? "aliceblue" : "white",
      team2StatsBackground: isTeam1Batting ? "white" : "aliceblue",
    });

    this.updateWicketsTable(data, bowlerName);

    this.setProperties(isTeam1Batting ? {
      bowler1: `${bowlerName}`,
      striker1: `Batting: ${battingTeam[data.active_batsman_index - 1]}`,
      nonStriker1: `Waiting: ${battingTeam[data.passive_batsman_index - 1]}`,
      bowler2: "",
      striker2: "",
      nonStriker2: ""
    } : {
      bowler2: `${bowlerName}`,
      striker2: `Batting: ${battingTeam[data.active_batsman_index - 1]}`,
      nonStriker2: `Waiting: ${battingTeam[data.passive_batsman_index - 1]}`,
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

  getBowlerName(balls) {
    let bowlerIndex;
    if (balls === 0) {
      return this.get('current_batting') === "team1" ? this.get('team2Players')[0] : this.get('team1Players')[0];
    }
    if (balls <= 66) {
      let over = Math.floor(balls / 6);
      let ball = balls % 6;
      bowlerIndex = over + (ball > 0 ? 1 : 0);
    } else {
      balls -= 66;
      let over = Math.floor(balls / 6);
      let ball = balls % 6;
      bowlerIndex = over + (ball > 0 ? 1 : 0);
    }

    if (bowlerIndex < 0 || bowlerIndex > 11) {
      return "Bowler";
    } else {
      return this.get('current_batting') === "team1" ? this.get('team2Players')[bowlerIndex - 1] : this.get('team1Players')[bowlerIndex - 1];
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
  }
});
