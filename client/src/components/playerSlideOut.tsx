import { h, Component } from 'react';
import Toggle from './toggle';

export default class PlayerSlideOut extends Component {
  constructor(props) {
    super(props);
    this.state = { player: null };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      player: Object.assign({}, nextProps.player)
    });
  }

  render() {
    return (
      <div className="slide-out player-slide-out">
        <div className="slide-out-header flex">
          <button className="dismiss-btn flex-pull-right" onClick={() => this.props.dismiss()}>&times;</button>
        </div>
        <img src={this.props.player.img} width="105" height="145" />
        <h1>{`${this.props.player.fname} ${this.props.player.lname}`}</h1>
        <h2>{this.props.player.pos} – #{this.props.player.num}</h2>
        <h3>Height: {this.props.player.height}</h3>
        <h3>Weight: {this.props.player.weight}</h3>
        <h4>{this.props.player.hs}</h4>
        <h4>{this.props.player.city}, {this.props.player.state}</h4>
      </div>
    );
  }
}