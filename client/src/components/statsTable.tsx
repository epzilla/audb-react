import { FC } from 'react';
import { gameIsInFuture } from '../lib/helpers';

interface IStatsTableProps {
  games,
  user,
  toggleUserAttend,
  currentYear,
  showRecord,
  config
}

export const StatsTable: FC<IStatsTableProps> = (props) => {
  const { games, user, toggleUserAttend, currentYear, showRecord, config } = props;
  let wins = 0;
  let losses = 0;
  let ties = 0;
  let confW = 0;
  let confL = 0;
  let confT = 0;
  let record;

  const rows = games.map((game, i) => {
    let resText;
    let rowClass;
    let attendCol;
    let dateParts = game.date.split('-');

    if (game.result === 'W') {
      resText = 'W';
      rowClass = 'win';
      wins++;
      if (game.confGame) {
        confW++;
      }
    } else if (game.result === 'L') {
      resText = 'L';
      rowClass = 'loss';
      losses++;
      if (game.confGame) {
        confL++;
      }
    } else {
      rowClass = 'tie';
      resText = currentYear === game.season ? '--' : 'T';
      if (game.season < 1996) {
        ties++;
        if (game.confGame) {
          confT++;
        }
      }
    }

    record = `${wins}–${losses}${ties > 0 ? '–' + ties : ''}`;
    if (confW || confL || confT) {
      record += ` (${confW}–${confL}${ties > 0 ? '–' + confT : ''})`;
    }

    if (user) {
      let didAttend = user.games.indexOf(game._id) !== -1;
      if (!gameIsInFuture(game)) {
        attendCol = (
          <td>
            <button className={didAttend ? 'btn primary attended' : 'btn not-attended'} onClick={() => toggleUserAttend(game._id)}>
              {didAttend ? '✔' : '—'}
            </button>
          </td>
        );
      }
      else {
        attendCol = <td></td>;
      }
    }

    return (
      <tr tabIndex={i + 11} className={rowClass}>
        <td>
          <span className="larger">{ `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}` }</span>
          <span className="smaller">{dateParts[0]}</span>
        </td>
        <td className="center">{ game.result }</td>
        <td className="logo-td center">
              <div className={`team-logo logo-${ game.opponent.replace(/\s+/g, '').replace(/&/g, '').replace(/\./g, '') }`}></div>
            </td>
        <td>
          <span className="larger">{game.opponent}</span>
          <span className="smaller">{game.opponentShortName}</span>
          <span className="smallest">{game.opponentAbbrev}</span>
        </td>
        <td>{ `${game.teamScore}–${game.opScore}` }</td>
        <td className="center">
          <span className="larger">{game.location}</span>
          <span className="smaller">{game.homeAwayNeutral}</span>
        </td>
        { attendCol }
      </tr>
    )
  });

  return (
    <div className="full-width">
      { showRecord ? <h2 className="record align-center">Record: { record }</h2> : null }
      <table className="stats-table center capped-size-table">
        <thead>
          <th>
            <span className="larger">Date</span>
            <span className="smaller">Year</span>
          </th>
          <th className="center">W/L</th>
          <th></th>
          <th>Team</th>
          <th>Score</th>
          <th className="center">
            <span className="larger">Location</span>
            <span className="smaller">Loc</span>
          </th>
          { user ? <th>Attended?</th> : null }
        </thead>
        <tbody>{ rows }</tbody>
      </table>
    </div>
  );
};