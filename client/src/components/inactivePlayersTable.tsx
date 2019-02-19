import { h, Component } from 'react';
import Toggle from './toggle';
import Rest from '../lib/rest-service';

export default class InactivePlayersTable extends Component {
  constructor(props) {
    super(props);
    this.state = { players : [] };
  }

  componentDidMount() {
    this.getPlayers();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.registerForRefresh) {
      nextProps.registerForRefresh(this.getPlayers);
    }
  }

  getPlayers = () => {
    Rest.get('players/inactive').then(players => {
      this.setState({ players });
    });
  };

  reactivate = (player) => {
    player.active = true;
    Rest.post(`player/${player._id}`, player).then(pl => {
      this.props.playerReactivated();
      this.getPlayers();
    }).catch(e => {
      console.error(e);
    })
  };

  render() {
    return (
      <table className="capped-size-table">
        <thead>
          <th>Name</th>
          <th>Pos</th>
          <th>Reactivate</th>
        </thead>
        <tbody>
          {
            this.state.players.map(pl => (
              <tr>
                <td>{pl.fname} {pl.lname}</td>
                <td>{pl.pos}</td>
                <td>
                  <button className="btn" onClick={() => this.reactivate(pl)}>+</button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );
  }
}