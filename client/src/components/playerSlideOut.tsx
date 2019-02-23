import React, { FC } from 'react';

interface IPlayerSlideOutProps {
  player: any;
  dismiss: () => void;
}

export const PlayerSlideOut: FC<IPlayerSlideOutProps> = ({ player, dismiss }) => (
  <div className="slide-out player-slide-out">
    <div className="slide-out-header flex">
      <button className="dismiss-btn flex-pull-right" onClick={() => dismiss()}>&times;</button>
    </div>
    <img src={player.img} width="105" height="145" />
    <h1>{`${player.fname} ${player.lname}`}</h1>
    <h2>{player.pos} – #{player.num}</h2>
    <h3>Height: {player.height}</h3>
    <h3>Weight: {player.weight}</h3>
    <h4>{player.hs}</h4>
    <h4>{player.city}, {player.state}</h4>
  </div>
);