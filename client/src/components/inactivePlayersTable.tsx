import React, { FC, useState, useEffect } from 'react';
import Rest from '../lib/rest-service';

interface IIPTProps {
  registerForRefresh: (fn: Function) => void;
  playerReactivated: () => void;
}

export const InactivePlayersTable: FC<IIPTProps> = ({ playerReactivated, registerForRefresh }) => {

  const [players, setPlayers] = useState<any[]>([]);
  useEffect(() => {
    if (!players) {
      getPlayers();
    }
  }, [players]);

  useEffect(() => {
    if (registerForRefresh) {
      registerForRefresh(getPlayers);
    }
  }, []);

  const getPlayers = async () => {
    setPlayers(await Rest.get('players/inactive'));
  };

  const reactivate = async (player) => {
    player.active = true;
    try {
      await Rest.post(`player/${player._id}`, player);
      playerReactivated();
      getPlayers();
    }
    catch (e) {
      console.error(e);
    }
  };

  return (
    <table className="capped-size-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Pos</th>
          <th>Reactivate</th>
        </tr>
      </thead>
      <tbody>
        {
          players.map(pl => (
            <tr>
              <td>{pl.fname} {pl.lname}</td>
              <td>{pl.pos}</td>
              <td>
                <button className="btn plus-btn" onClick={() => reactivate(pl)}>+</button>
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  );
};