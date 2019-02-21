import { FC, useState, useEffect } from 'react';
import Rest from '../lib/rest-service';
import LocalStorageService from '../lib/local-storage-service';
import { gameIsInFuture } from '../lib/helpers';
import config from '../config';

const years = [];
const currentYear = new Date().getFullYear();
const champs = config.championships;
const warYears = config.warYears;

for (let i = currentYear + 1; i >= config.firstSeason; i--) {
  years.push(i);
}

interface IYearlyProps {
  user: any;
  toggleUserAttend: (gameId: string) => void;
}

export const YearlyResultsView: FC<IYearlyProps> = (props) => {
  const [year, setYear] = useState(currentYear);
  const [results, setResults] = useState([]);

  let table;
  let rows = [];
  let record = { w: 0, l: 0, t: 0, confW: 0, confL: 0, confT: 0 };
  let warYear;

  const onChange = (e) => {
    if (e && e.target.value) {
      changeYear(parseInt(e.target.value));
    }
  };

  const changeYear = (year) => {
    setYear(year);
    getResultsByYear(year);
  };

  const getResultsByYear = (year) => {
    let results = LocalStorageService.get(`yr-${year}`);
    if (results) {
      setResults(results);
    }

    Rest.get(`year/${year}`).then(res => {
      setResults(res);
      if (JSON.stringify(res) !== JSON.stringify(results)) {
        LocalStorageService.set(`yr-${year}`, res);
      }
    });
  };

  const toggleAttend = (gameId: string) => {
    Rest.post(`updateAttendance/${gameId}`).then(() => {
      props.toggleUserAttend(gameId);
    });
  };

  const next = () => {
    let nexyYear = year + 1;
    if (nexyYear <= currentYear + 1) {
      changeYear(nexyYear);
    }
  };

  const prev = () => {
    let prevYear = year - 1;
    if (prevYear >= config.firstSeason) {
      changeYear(prevYear);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === ' ' && e.target.nodeName === 'TR') {
      let btn = e.target.querySelector('.btn');
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        btn.click();
      }
    }
  };

  const onKeyUp = ({ key, target }) => {
    if (target.nodeName !== 'INPUT') {
      switch (key) {
        case 'ArrowLeft':
          prev();
          break;
        case 'ArrowRight':
          next();
          break;
      }
    }
  }

  useEffect(() => {
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('keyup', onKeyUp);
    }
  }, []);

  if (warYears.indexOf(year) === -1) {
    rows = results.map((game, i) => {
      let resText;
      let rowClass = game.confGame ? 'conf-game' : '';
      let attendCol;

      if (game.result === 'W') {
        resText = 'W';
        rowClass += ' win';
        record.w++;
        if (game.confGame) {
          record.confW++;
        }
      } else if (game.result === 'L') {
        resText = 'L';
        rowClass += ' loss';
        record.l++;
        if (game.confGame) {
          record.confL++;
        }
      } else {
        rowClass += ' tie';
        resText = '--';
        if (year < 1996) {
          resText = 'T';
          record.t++;
          if (game.confGame) {
            record.confT++;
          }
        }
      }

      let dateParts = game.date.split('-');
      let date = `${dateParts[1]}/${dateParts[2]}`;

      if (props.user && year <= currentYear) {
        if (!gameIsInFuture(game)) {
          let didAttend = props.user.games.indexOf(game._id) !== -1;
          attendCol = (
            <td>
              <button className={didAttend ? 'btn primary attended' : 'btn not-attended'} onClick={() => toggleAttend(game._id)}>
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
        <tr className={rowClass} tabIndex={i + 11}>
          <td>{date}</td>
          <td className="center">{resText}</td>
          <td className="logo-td center">
            <div className={`team-logo logo-${game.opponent.replace(/\s+/g, '').replace(/&/g, '').replace(/\./g, '')}`}></div>
          </td>
          <td>
            <span className="larger">{game.opponent}</span>
            <span className="smaller">{game.opponentShortName}</span>
            <span className="smallest">{game.opponentAbbrev}</span>
          </td>
          <td>{`${game.teamScore}–${game.opScore}`}</td>
          <td className="larger">
            <span>{game.location}</span>
          </td>
          <td className="center smaller">
            <span>{game.homeAwayNeutral}</span>
          </td>
          {attendCol}
        </tr>
      );
    });

    table = (
      <table className="capped-size-table">
        <thead>
          <th>Date</th>
          <th className="center">W/L</th>
          <th className="center"></th>
          <th>
            <span className="larger">Opponent</span>
            <span className="smaller">Team</span>
          </th>
          <th>Score</th>
          <th className="center smaller">
            <span className="smaller">Loc</span>
          </th>
          <th className="larger">
            <span>Location</span>
          </th>
          {props.user && year <= currentYear ? <th className="center">Attended?</th> : null}
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }

  let confChampBanner;
  let natChampBanner;

  // Iterate over division championships and if one is found for this year, set the banner
  let divChamps = champs && champs.division ? Object.keys(champs.division) : [];
  for (let i = 0; i < divChamps.length; i++) {
    if (champs.division[divChamps[i]].indexOf(year) !== -1) {
      confChampBanner = <h3 className="record-stat div-champ-banner">{divChamps[i]} Champions</h3>;
      break;
    }
  }

  // Do the same for conference championships (which overwrite divisional championships, as those are implied)
  let confChamps = champs && champs.conference ? Object.keys(champs.conference) : [];
  for (let i = 0; i < confChamps.length; i++) {
    if (champs.conference[confChamps[i]].indexOf(year) !== -1) {
      confChampBanner = <h2 className="record-stat conf-champ-banner">{confChamps[i]} Champions</h2>;
      break;
    }
  }

  // Finally, do the iteration for national championships
  let natChamps = champs && champs.national ? Object.keys(champs.national) : [];
  for (let i = 0; i < natChamps.length; i++) {
    if (champs.national[natChamps[i]].indexOf(year) !== -1) {
      natChampBanner = <h1 className="record-stat nat-champ-banner">{natChamps[i]} National Champions</h1>;
      break;
    }
  }

  if (warYears && warYears.indexOf(year) !== -1) {
    warYear = (
      <div className="jumbotron">
        <h1>Allies 1 - Axis 0</h1>
        <img src="/assets/images/Uncle-Sam.jpg" />
      </div>
    );
  }

  return (
    <div className="main yearly">
      <h1>{year} {config.team} Football results</h1>
      <div className="flex-center flex-col">
        <select className="big-select margin-bottom-1rem" onChange={onChange}>
          {
            years.map(y => <option value={y} selected={y === year}>{y}</option>)
          }
        </select>
        {table}
        {warYear}
        <h3 className="record-stat">
          {
            year < 1996 && record.t > 0 ?
              `${record.w}-${record.l}-${record.t} (${record.confW}-${record.confL}-${record.confT})` :
              `${record.w}-${record.l} (${record.confW}-${record.confL})`
          }
        </h3>
        {confChampBanner}
        {natChampBanner}
      </div>
    </div>
  );
};