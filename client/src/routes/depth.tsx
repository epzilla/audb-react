import { h, Component } from 'react';
import Rest from '../lib/rest-service';
import LocalStorageService from '../lib/local-storage-service';
import PlayerSlideOut from '../components/PlayerSlideOut';
import DepthChart from '../components/DepthChart';
import CSSTransitionGroup from 'react-css-transition-group';

export default class Depth extends Component {
  constructor(props) {
    super(props);
    this.year = new Date().getFullYear();
    this.state = {
      players: [],
      playerSlideOut: null
    };
  }

  componentDidMount() {
    this.getPlayers();
  }

  getPlayers = () => {
    let players = LocalStorageService.get('players');
    if (players) {
      this.setState({ players });
    }

    Rest.get('playersByPos').then(pls => {
      if (JSON.stringify(pls) !== JSON.stringify(players)) {
        this.setState({ players: pls });
        LocalStorageService.set('players', pls);
      }
    });
  };

  showPlayerSlideOut = (player) => {
    this.setState({ playerSlideOut: player });
  };

  dismissPlayerSlideOut = () => {
    this.setState({ playerSlideOut: null });
  };

  render() {
    let players = this.state.players;
    let playerSlideOut;
    let playerEls = {
      QB: [],
      RB: [],
      FB: [],
      TE: [],
      LT: [],
      LG: [],
      C: [],
      RG: [],
      RT: [],
      Slot: [],
      WR2: [],
      WR9: [],
      DT: [],
      NG: [],
      SDE: [],
      WDE: [],
      WLB: [],
      SLB: [],
      MLB: [],
      SS: [],
      FS: [],
      LCB: [],
      RCB: [],
      P: [],
      K: []
    };

    if (players && this.state.playerSlideOut) {
      playerSlideOut = <PlayerSlideOut player={this.state.playerSlideOut} dismiss={this.dismissPlayerSlideOut} />;
    }

    return (
      <div className="main depth">
        <h1>{ this.year } { this.props.config.team } Football Depth Chart</h1>

        <CSSTransitionGroup
          transitionName="slide-out"
          transitionAppear={true}
          trasnsitionLeave={true}
          transitionEnter={true}
          transitionEnterTimeout={0}
          transitionLeaveTimeout={0}>
          {playerSlideOut || []}
        </CSSTransitionGroup>

        <DepthChart
          selectedCallback={(player) => this.showPlayerSlideOut(player)}
          players={this.state.players}
        />
      </div>
    );
  }
}
