import { h, Component } from 'react';

export default class DepthChart extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps({ players }) {
    if (players) {
      this.setState({ players });
    }
  }

  handleDragstart = e => {
    e.dataTransfer.setData("text/plain", e.target.dataset['player']);
  };

  handleDragenter = e => {
    e.preventDefault();
    e.target.classList.add('can-drop');
  };

  handleDragleave = e => {
    e.target.classList.remove('can-drop');
  };

  handleDragover = e => {
    e.preventDefault();
    e.target.classList.add('can-drop');
  };

  handleDrop = e => {
    let player, replacedPlayer;

    if (e.target.nodeName === 'A') {
      e.preventDefault();
      player = JSON.parse(e.dataTransfer.getData("text/plain"));
      // Replace player in depth chart
      let parent = e.target.parentElement.parentElement;
      if (parent.classList.contains('player-row')) {
        replacedPlayer = JSON.parse(parent.dataset['player']);
        this.props.swapPlayers(player, replacedPlayer, false, false);
      }
    }
    else if (e.target.classList.contains('player-group')) {
      // Make him last string
      e.preventDefault();
      player = JSON.parse(e.dataTransfer.getData("text/plain"));
      let pos = e.target.dataset['pos'];
      replacedPlayer = this.props.players[pos][this.props.players[pos].length - 1];
      this.props.swapPlayers(player, replacedPlayer, false, true);
    }
    else if (e.target.nodeName === 'H4') {
      // Make him 1st string
      e.preventDefault();
      player = JSON.parse(e.dataTransfer.getData("text/plain"));
      let pos = e.target.parentElement.dataset['pos'];
      replacedPlayer = this.props.players[pos][0];
      this.props.swapPlayers(player, replacedPlayer, true, false);
    }

    let elems = document.querySelectorAll('.can-drop');
    Array.from(elems).forEach(el => el.classList.remove('can-drop'));
  };

  render() {
    if (!this.state.players) {
      return null;
    }

    let playerEls = {};
    let players = this.state.players;

    Object.keys(players).forEach(posGroup => {
      playerEls[posGroup] = players[posGroup].map(player => {
        return (
          <div id={player._id}
            className={!!player.retStart ? 'player-row returning-starter' : 'player-row'}
            draggable={this.props.editable}
            onDragstart={(e) => this.handleDragstart(e)}
            data-order={player.stringNum}
            data-player={JSON.stringify(player)}
            >
            <p>
              <a onClick={() => this.props.selectedCallback(player)}>{`${player.num} - ${player.fname} ${player.lname} - ${player.year}`}</a>
            </p>
          </div>
        );
      });
    });

    return (
      <div className="depth-chart"
        onDragenter={(e) => this.handleDragenter(e)}
        onDragover={(e) => this.handleDragover(e)}
        onDragleave={(e) => this.handleDragleave(e)}
        onDrop={(e) => this.handleDrop(e)}
      >
        <div className="flex-center">
          <h2 className="upper">Offense</h2>
        </div>

        {/* Backs */}
        <div className="row depth flex-center">
          <div className="player-group player-group-o small-screen-3" data-pos="FB">
            <h4>FB</h4>
            {playerEls.FB}
          </div>
          <div className="player-group player-group-o small-screen-1" data-pos="QB">
            <h4>QB</h4>
            {playerEls.QB}
          </div>
          <div className="player-group player-group-o small-screen-2" data-pos="RB">
            <h4>RB</h4>
            {playerEls.RB}
          </div>
        </div>

        {/* WRs and TEs */}
        <div className="row depth flex-center">
          <div className="flex">
            <div className="player-group player-group-o" data-pos="WR9">
              <h4>WR</h4>
              {playerEls.WR9}
            </div>
            <div className="player-group player-group-o" data-pos="Slot">
              <h4>WR</h4>
              {playerEls.Slot}
            </div>
          </div>
          <div className="flex flex-pull-right">
            <div className="player-group player-group-o" data-pos="TE">
              <h4>TE</h4>
              {playerEls.TE}
            </div>
            <div className="player-group player-group-o" data-pos="WR2">
              <h4>WR</h4>
              {playerEls.WR2}
            </div>
          </div>
        </div>

        {/* O-Line */}
        <div className="row depth flex-center">
          <div className="player-group player-group-o" data-pos="RT">
            <h4>RT</h4>
            {playerEls.RT}
          </div>
          <div className="player-group player-group-o" data-pos="RG">
            <h4>RG</h4>
            {playerEls.RG}
          </div>
          <div className="player-group player-group-o" data-pos="C">
            <h4>C</h4>
            {playerEls.C}
          </div>
          <div className="player-group player-group-o" data-pos="LG">
            <h4>LG</h4>
            {playerEls.LG}
          </div>
          <div className="player-group player-group-o" data-pos="LT">
            <h4>LT</h4>
            {playerEls.LT}
          </div>
        </div>

        <div className="row">
          <div className="flex-center">
            <h2 className="upper">Defense</h2>
          </div>
        </div>

        {/* D-Line */}
        <div className="row depth flex-center">
          <div className="player-group player-group-d" data-pos="WDE">
            <h4>WDE</h4>
            {playerEls.WDE}
          </div>
          <div className="player-group player-group-d" data-pos="DT">
            <h4>DT</h4>
            {playerEls.DT}
          </div>
          <div className="player-group player-group-d" data-pos="NG">
            <h4>DT</h4>
            {playerEls.NG}
          </div>
          <div className="player-group player-group-d" data-pos="SDE">
            <h4>SDE</h4>
            {playerEls.SDE}
          </div>
        </div>

        {/* LBs */}
        <div className="row depth flex-center">
          <div className="player-group player-group-d" data-pos="WLB">
            <h4>WLB</h4>
            {playerEls.WLB}
          </div>
          <div className="player-group player-group-d" data-pos="MLB">
            <h4>MLB</h4>
            {playerEls.MLB}
          </div>
          <div className="player-group player-group-d" data-pos="SLB">
            <h4>SLB</h4>
            {playerEls.SLB}
          </div>
        </div>

        {/* LBs */}
        <div className="row depth flex-space-between">
          <div className="player-group player-group-d" data-pos="LCB">
            <h4>LCB</h4>
            {playerEls.LCB}
          </div>
          <div className="player-group player-group-d" data-pos="FS">
            <h4>S</h4>
            {playerEls.FS}
          </div>
          <div className="player-group player-group-d" data-pos="SS">
            <h4>S</h4>
            {playerEls.SS}
          </div>
          <div className="player-group player-group-d" data-pos="RCB">
            <h4>RCB</h4>
            {playerEls.RCB}
          </div>
        </div>

        <p className="align-center"><strong>Bold</strong> denotes returning starter.</p>
      </div>
    );
  }
}
