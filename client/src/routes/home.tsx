import { h, Component } from 'react';
import Rest from '../lib/rest-service';
import { Link } from 'react-router/match';
import d3 from 'd3';
import crossfilter from 'crossfilter';
import { BarChart, PieChart, RowChart } from '../lib/react-dc/react-dc';
import StatsTable from '../components/statsTable';
import Expandable from '../components/expandable';
import Avatar from '../components/avatar';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.currentYear = new Date().getFullYear();
    this.state = {
      record: {
        w: 0,
        l: 0,
        t: 0,
        confW: 0,
        confL: 0,
        confT: 0,
        total: 0
      }
    };
  }

  componentWillReceiveProps({ games }) {
    if (games) {
      let record = {
        w: 0,
        l: 0,
        t: 0,
        confW: 0,
        confL: 0,
        confT: 0,
        total: 0
      };

      for (let i = 0; i < games.length; i++) {
        record.total++;
        switch(games[i].result) {
          case 'W':
            record.w++;
            if (games[i].confGame) {
              record.confW++;
            }
            break;
          case 'L':
            record.l++;
            if (games[i].confGame) {
              record.confL++;
            }
            break;
          default:
            record.t++;
            if (games[i].confGame) {
              record.confT++;
            }
        }
      }

      let data = crossfilter(games);
      let oppDimension = data.dimension(game => game.opponent);
      let homeDimension = data.dimension(game => {
        if (game.homeAwayNeutral === 'H') {
          return 'Home';
        }
        else if (game.homeAwayNeutral === 'A') {
          return 'Away';
        }
        else {
          return 'Neutral';
        }
      });
      let wlDimension = data.dimension(game => {
        if (game.result === 'W') {
          return 'Win';
        } else if (game.result === 'L') {
          return 'Loss';
        } else {
          return 'Tie';
        }
      });
      let confDimension = data.dimension(game => {
        if (game.conference === 'Pac-10') {
          return 'Pac-12';
        } else if (game.conference === 'Conference-USA') {
          return 'Conf-USA';
        } else if (game.conference === 'confGameWest') {
          return 'confGame (West)';
        } else if (game.conference === 'confGameEast') {
          return 'confGame (East)';
        } else {
          return game.conference;
        }
      });

      let oppGroup = oppDimension.group();
      let confGroup = confDimension.group();
      let homeGroup = homeDimension.group();
      let wlGroup = wlDimension.group();

      this.setState({
        record,
        data,
        oppDimension,
        homeDimension,
        wlDimension,
        confDimension,
        oppGroup,
        confGroup,
        wlGroup,
        homeGroup
      });
    }
  }

  render() {
    if (!this.props.user) {
      let p1 = `This site was created to provide ${ this.props.config.team } football fans with a quick way to look up
              all-time win/loss records, recruiting info, and the depth chart (with more features
              coming soon). All of that information can be accessed without registering for an account.
              If you do choose to register, you'll get the added benefit of tracking your attendance at
              ${ this.props.config.team } games and seeing what your lifetime record is. For games in the past, you can click
              on the "Attended" button on the year-by-year page to register your attendance. And for
              games from here on out, there's a handy checkin function you can use.`;

      let p2 = `So make yourself at home, and if the attendance tracking feature appeals to you,
              go ahead and sign up. It's free, and we'll only send you one welcome email and nothing more.`;

      return (
        <div className="main home">
          <div className="jumbotron">
            <h1>Welcome to { this.props.config.siteName }!</h1>
            <p className="lede">{ p1 }</p>
            <p className="lede">{ p2 }</p>
            <p className="lede">Enjoy the site, and { this.props.config.teamSlogan }!</p>
            <p className="align-center">
              <Link role="button" className="btn big btn-success" href="/sign-up">Sign Up</Link>
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="main home">
        <div className="page-header user-header-row">
          <Avatar avatar={this.props.user.avatar} big />
          <div className="flex-col user-profile-stats">
            <h1 className="align-center">{ this.props.user.name }</h1>
            <h4 className="align-center">Games Attended: { this.state.record.w + this.state.record.l + this.state.record.t }</h4>
            <h4 className="align-center">Record: { this.state.record.w }-{ this.state.record.l }-{ this.state.record.t } ({ this.state.record.confW }-{ this.state.record.confL }-{ this.state.record.confT })</h4>
          </div>
        </div>
        <StatsTable
          games={this.props.games}
          user={this.props.user}
          currentYear={this.currentYear}
          config={this.props.config}
          showRecord={false}
        />
        <hr />
        <Expandable title="Charts" defaultCollapsed centered>
          <div className="row">
            <PieChart dimension={this.state.oppDimension} group={this.state.oppGroup} height={350} innerRadius={40} externalRadiusPadding={20} minAngleForLabel={0.2} />
          </div>
          <div className="row">
            <PieChart dimension={this.state.confDimension} group={this.state.confGroup} height={350} innerRadius={40} externalRadiusPadding={20} minAngleForLabel={0.2} />
          </div>
          <div className="row">
            <PieChart dimension={this.state.wlDimension} group={this.state.wlGroup} height={350} innerRadius={40} externalRadiusPadding={20} />
          </div>
          <div className="row">
            <PieChart dimension={this.state.homeDimension} group={this.state.homeGroup} height={350} innerRadius={40} externalRadiusPadding={20} minAngleForLabel={0.2} />
          </div>
        </Expandable>
      </div>
    );
  }
}
