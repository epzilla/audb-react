import React, { FC, useState, useRef} from 'react';
import Rest from '../lib/rest-service';
import LocalStorageService from '../lib/local-storage-service';
import { PlayerSlideOut } from '../components/PlayerSlideOut';
import { DepthChart } from '../components/DepthChart';
import { CSSTransitionGroup } from 'react-transition-group';
import config from '../config';

interface IDepthProps {
  swapPlayers: Function;
}

export const Depth: FC<IDepthProps> = ({ swapPlayers }) => {

  const year = useRef(new Date().getFullYear());
  const [players, setPlayers] = useState([]);
  const [showPlayerSlideOut, setShowPlayerSlideOut] = useState(null);

  const getPlayers = () => {
    let pls = LocalStorageService.get('players');
    if (pls) {
      setPlayers(pls);
    }

    Rest.get('playersByPos').then(pls => {
      if (JSON.stringify(pls) !== JSON.stringify(players)) {
        setPlayers(pls);
        LocalStorageService.set('players', pls);
      }
    });
  };

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

  if (players && playerSlideOut) {
    playerSlideOut = <PlayerSlideOut player={playerSlideOut} dismiss={() => setShowPlayerSlideOut(null)} />;
  }

  return (
    <div className="main depth">
      <h1>{year.current} {config.team} Football Depth Chart</h1>

      <CSSTransitionGroup
        transitionName="slide-out"
        transitionAppear={true}
        transitionLeave={true}
        transitionEnter={true}
        transitionEnterTimeout={0}
        transitionLeaveTimeout={0}>
        {
          players && showPlayerSlideOut ?
          <PlayerSlideOut player={playerSlideOut} dismiss={() => setShowPlayerSlideOut(null)} />
          :
          []
        }
      </CSSTransitionGroup>

      <DepthChart
        selectedCallback={(player) => setShowPlayerSlideOut(player)}
        players={players}
        editable={false}
        swapPlayers={swapPlayers}
      />
    </div>
  );
};