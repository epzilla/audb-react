import React, { FC, useState } from 'react';
import { Toggle } from './Toggle';
import { PlayerSlideOut } from './PlayerSlideOut';

const years = ['FR', 'RFR', 'SO', 'JR', 'SR'];
const positions = [
  'QB', 'RB', 'FB', 'TE', 'WR2', 'WR9', 'Slot', 'LT', 'LG', 'C', 'RG', 'RT',
  'WDE', 'DT', 'NG', 'SDE', 'WLB', 'MLB', 'SLB', 'LCB', 'RCB', 'FS', 'SS',
  'K', 'P'
];
const states = [
  'AK', 'AL', 'AR', 'AS', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'GU',
  'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN',
  'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK',
  'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VI', 'VT', 'WA',
  'WI', 'WV', 'WY'
];

interface IEPSOProps {
  player: any;
  dismiss: () => void;
  save: (player: any) => void;
}

export const EditablePlayerSlideOut: FC<IEPSOProps> = ({ player, dismiss, save }) => {

  const [editedPlayer, setEditedPlayer] = useState(player);

  const reset = () => {
    setEditedPlayer(player);
  };

  const setValue = (e) => {
    let pl = editedPlayer;
    pl[e.target.name] = e.target.value;
    setEditedPlayer(pl);
  };

  const toggle = (property) => {
    let pl = editedPlayer;
    pl[property] = !player[property];
    setEditedPlayer(pl);
  };

  return (
    <div className="slide-out player-slide-out editable-slide-out">
      <div className="slide-out-header flex">
        <button className="dismiss-btn flex-pull-right" onClick={dismiss}>&times;</button>
      </div>
      <div className="edit-row flex">
        <div className="flex-col">
          <img src={editedPlayer.img} width="105" />
        </div>
        <div className="flex-col">
          <div className="flex-col">
            <label>First Name</label>
            <input type="text" name="fname" onChange={setValue} value={editedPlayer.fname} />
          </div>
          <div className="flex-col">
            <label>Number</label>
            <input type="number" max="99" min="1" name="num" onChange={setValue} value={editedPlayer.num} />
          </div>
          <div className="flex-col triple">
            <label>Active?</label>
            <Toggle id="active-player" toggled={toggle} onOff={editedPlayer.active} property="active" />
          </div>
        </div>
        <div className="flex-col">
          <div className="flex-col">
            <label>Last Name</label>
            <input type="text" name="lname" onChange={setValue} value={editedPlayer.lname} />
          </div>
          <div className="flex-col">
            <label>Position</label>
            <select onChange={setValue} name="truePos">
              {
                positions.map(p => <option key={p} value={p} selected={editedPlayer.truePos === p}>{p}</option>)
              }
            </select>
          </div>
          <div className="flex-col triple">
            <label>Ret. Starter?</label>
            <Toggle id="retStart-player" toggled={toggle} onOff={editedPlayer.retStart} property="retStart" />
          </div>
        </div>
      </div>
      <div className="edit-row flex">
        <div className="flex-col triple">
          <label>City</label>
          <input type="text" name="city" onChange={setValue} value={editedPlayer.city} />
        </div>
        <div className="flex-col triple">
          <label>State</label>
          <select onChange={setValue} name="state">
            {
              states.map(s => <option key={s} value={s} selected={editedPlayer.state === s}>{s}</option>)
            }
          </select>
        </div>
        <div className="flex-col triple">
          <label>Year</label>
          <select onChange={setValue} name="year">
            {
              years.map(y => <option key={y} value={y} selected={editedPlayer.year === y}>{y}</option>)
            }
          </select>
        </div>
      </div>
      <div className="edit-row flex">
        <div className="flex-col triple">
          <label>Height</label>
          <input type="text" name="height" onChange={setValue} value={editedPlayer.height} />
        </div>
        <div className="flex-col triple">
          <label>Weight</label>
          <input type="number" min="150" max="450" name="weight" onChange={setValue} value={editedPlayer.weight} />
        </div>
        <div className="flex-col triple">
          <label>String</label>
          <input type="number" max="7" min="1" name="stringNum" onChange={setValue} value={editedPlayer.stringNum} />
        </div>
      </div>
      <div className="flex flex-pull-right flex-push-bottom">
        <button className="btn big primary" onClick={() => save(player)}>Save</button>
        <button className="btn big" onClick={reset}>Reset</button>
      </div>
    </div>
  );
};