import { h, Component } from 'react';
import Toggle from './toggle';
import PlayerSlideOut from './playerSlideOut';

export default class EditablePlayerSlideOut extends PlayerSlideOut {
  constructor(props) {
    super(props);
    this.state = { player: null };
    this.positions = [
      'QB', 'RB', 'FB', 'TE', 'WR2', 'WR9', 'Slot', 'LT', 'LG', 'C', 'RG', 'RT',
      'WDE', 'DT', 'NG', 'SDE', 'WLB', 'MLB', 'SLB', 'LCB', 'RCB', 'FS', 'SS',
      'K', 'P'
    ];
    this.years = ['FR', 'RFR', 'SO', 'JR', 'SR'];
    this.states = [
      'AK', 'AL', 'AR', 'AS', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'GU',
      'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN',
      'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK',
      'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VI', 'VT', 'WA',
      'WI', 'WV', 'WY'
    ];
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      player: Object.assign({}, nextProps.player)
    });
  }

  reset = () => {
    this.setState({ player: this.props.player });
  };

  setValue = (e) => {
    let player = this.state.player;
    player[e.target.name] = e.target.value;
    this.setState({ player });
  };

  toggle = (property) => {
    let player = this.state.player;
    player[property] = !player[property];
    this.setState({ player });
  };

  render() {
    let player = this.state && this.state.player ? this.state.player : this.props.player;

    return (
      <div className="slide-out player-slide-out editable-slide-out">
        <div className="slide-out-header flex">
          <button className="dismiss-btn flex-pull-right" onClick={() => this.props.dismiss()}>&times;</button>
        </div>
        <div className="edit-row flex">
          <div className="flex-col">
            <img src={player.img} width="105" />
          </div>
          <div className="flex-col">
            <div className="flex-col">
              <label>First Name</label>
              <input type="text" name="fname" onChange={(e) => this.setValue(e)} value={player.fname} />
            </div>
            <div className="flex-col">
              <label>Number</label>
              <input type="number" max="99" min="1" name="num" onChange={(e) => this.setValue(e)} value={player.num} />
            </div>
            <div className="flex-col triple">
              <label>Active?</label>
              <Toggle id="active-player" toggled={this.toggle} onOff={player.active} property="active" />
            </div>
          </div>
          <div className="flex-col">
            <div className="flex-col">
              <label>Last Name</label>
              <input type="text" name="lname" onChange={(e) => this.setValue(e)} value={player.lname} />
            </div>
            <div className="flex-col">
              <label>Position</label>
              <select onChange={this.setValue} name="truePos">
                {
                  this.positions.map(p => <option value={p} selected={player.truePos === p}>{p}</option>)
                }
              </select>
            </div>
            <div className="flex-col triple">
              <label>Ret. Starter?</label>
              <Toggle id="retStart-player" toggled={this.toggle} onOff={player.retStart} property="retStart" />
            </div>
          </div>
        </div>
        <div className="edit-row flex">
          <div className="flex-col triple">
            <label>City</label>
            <input type="text" name="city" onChange={(e) => this.setValue(e)} value={player.city} />
          </div>
          <div className="flex-col triple">
            <label>State</label>
            <select onChange={this.setValue} name="state">
              {
                this.states.map(s => <option value={s} selected={player.state === s}>{s}</option>)
              }
            </select>
          </div>
          <div className="flex-col triple">
            <label>Year</label>
            <select onChange={this.setValue} name="year">
              {
                this.years.map(y => <option value={y} selected={player.year === y}>{y}</option>)
              }
            </select>
          </div>
        </div>
        <div className="edit-row flex">
          <div className="flex-col triple">
            <label>Height</label>
            <input type="text" name="height" onChange={(e) => this.setValue(e)} value={player.height} />
          </div>
          <div className="flex-col triple">
            <label>Weight</label>
            <input type="number" min="150" max="450" name="weight" onChange={(e) => this.setValue(e)} value={player.weight} />
          </div>
          <div className="flex-col triple">
            <label>String</label>
            <input type="number" max="7" min="1" name="stringNum" onChange={(e) => this.setValue(e)} value={player.stringNum} />
          </div>
        </div>
        <div className="flex flex-pull-right flex-push-bottom">
          <button className="btn big primary" onClick={() => this.props.save(player)}>Save</button>
          <button className="btn big" onClick={() => this.reset()}>Reset</button>
        </div>
      </div>
    );
  }
}