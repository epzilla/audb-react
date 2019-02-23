import React, { FC, useState, useRef, useEffect } from 'react';
import Rest from '../lib/rest-service';
import LocalStorageService from '../lib/local-storage-service';
import config from '../config';

const years: number[] = [];
const columns: any[] = [
  { field: 'lname', name: 'Name'},
  { field: 'pos', name: 'Pos'},
  { field: 'state', name: 'Hometown'},
  { field: 'hs', name: 'School', hideSmall: true},
  { field: 'rivalsStars', name: 'Rivals Stars', hideSmall: true, center: true},
  { field: 'scoutStars', name: 'Scout Stars', hideSmall: true, center: true},
  { field: 'rivalsRank', name: 'Rivals Rank', hideSmall: true, center: true},
  { field: 'scoutRank', name: 'Scout Rank', hideSmall: true, center: true},
  { field: 'avgStars', name: 'Stars', hideLarge: true, center: true},
  { field: 'avgRank', name: 'Rank', hideLarge: true, center: true}
];

const maps: { [yr: number]: string } = config.recruitMaps;

let d = new Date();
const currentYear = d.getMonth() < 2 ? d.getFullYear() : d.getFullYear() + 1;
const firstTrackedClass = config.firstTrackedRecruitingSeason || currentYear;

for (let i = currentYear + 2; i >= firstTrackedClass; i--) {
  years.push(i);
}

export const RecruitingView: FC = () => {
  const [year, setYear] = useState(currentYear);
  const [recruits, setRecruits] = useState<any[]>([]);
  const [sortCol, setSortCol] = useState('lname');
  const [sortAsc, setSortAsc] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getRecruits(currentYear);
    document.addEventListener('keyup', onKeyUp);
    return () => document.removeEventListener('keyup', onKeyUp);
  }, []);

  const onKeyUp = ({ key, target, shiftKey }) => {
    if (target.nodeName !== 'INPUT') {
      switch (key) {
        case '/':
          if (inputRef && inputRef.current) {
            inputRef.current.focus();
          }
          break;
        case 'ArrowLeft':
          prev();
          break;
        case 'ArrowRight':
          next();
          break;
        case 'n':
          sortByCol('lname');
          break;
        case 'p':
          sortByCol('pos');
          break;
        case 'h':
          sortByCol('hs');
          break;
        case 'H':
          sortByCol('state')
          break;
        case 'r':
          sortByCol('rivalsStars');
          break;
        case 'R':
          sortByCol('rivalsRank');
          break;
        case 's':
          sortByCol('scoutStars');
          break;
        case 'S':
          sortByCol('scoutRank');
          break;
      }
    }
  };

  const onChange = (e) => {
    if (e && e.target.value) {
      changeYear(parseInt(e.target.value));
    }
  };

  const changeYear = (y) => {
    setYear(y);
    getRecruits(year);
  };

  const getRecruits = (recruitYear) => {
    let recs = LocalStorageService.get(`rec-${recruitYear}`);
    if (recs) {
      setRecruits(recs);
    }

    Rest.get(`recruits/${year}`).then(res => {
      setRecruits(res);
      if (JSON.stringify(res) !== JSON.stringify(recruits)) {
        LocalStorageService.set(`rec-${year}`, res);
      }
    });
  };

  const sortByCol = (field) => {
    let col = columns.find(c => c.field === field);
    if (col) {
      let currentSortField = sortCol;
      if (currentSortField === col.field) {
        // We are just re-sorting the already chosed column
        setSortAsc(!sortAsc);
      } else {
        setSortCol(col.field);
      }
    }
  };

  const next = () => {
    let nextYear = year + 1;
    if (nextYear <= currentYear + 2) {
      changeYear(nextYear);
    }
  };

  const prev = () => {
    let prevYear = year - 1;
    if (prevYear >= config.firstSeason) {
      changeYear(prevYear);
    }
  };

  let headers: any[] = [];

  recruits.sort((a, b) => {
    if (!a[sortCol] || !b[sortCol]) {
      return 0;
    }

    if (typeof a[sortCol] === 'string') {
      let nameA = a[sortCol].toUpperCase();
      let nameB = b[sortCol].toUpperCase();
      if (nameA < nameB) {
        return sortAsc ? -1 : 1;
      }
      if (nameA > nameB) {
        return sortAsc ? 1 : -1;
      }
      return 0;
    }

    if (typeof a[sortCol] === 'number') {
      return sortAsc ? (a[sortCol] - b[sortCol]) : (b[sortCol] - a[sortCol]);
    }

    return 0;
  });

  headers = columns.map(col => {
    let arrow;
    let className = col.field;

    if (col.center) {
      className += ' center';
    }

    if (col.hideSmall) {
      className += ' larger';
    }
    else if (col.hideLarge) {
      className += ' smaller';
    }

    if (sortCol === col.field) {
      className += ' sort';
      className += (sortAsc ? 'asc' : 'desc');

      arrow = sortAsc ? <span className="sort-arrow">▲</span> : <span className="sort-arrow">▼</span>;
    }

    return (<th className={className} onClick={() => sortByCol(col.field)}>{col.name}{arrow}</th>);
  });

  return (
    <div className="main recruiting">
      <h1>{ config.team } Football Recruiting</h1>
      <select className="big-select margin-bottom-1rem" onChange={onChange}>
        {
          years.map(y => <option value={y} selected={y === year}>{y}</option>)
        }
      </select>
      <table className="recruits-table">
        <thead>
          { headers }
        </thead>
        <tbody>
          {
            recruits.map(rec => {
              return (
                <tr>
                  <td>{`${rec.fname} ${rec.lname}`}</td>
                  <td>{rec.pos}</td>
                  <td>{`${rec.city}, ${rec.state}`}</td>
                  <td className="larger">{rec.hs}</td>
                  <td className="larger center">{`${rec.rivalsStars} ★`}</td>
                  <td className="larger center">{`${rec.scoutStars} ★`}</td>
                  <td className="larger center">{rec.rivalsRank}</td>
                  <td className="larger center">{rec.scoutRank}</td>
                  <td className="smaller center">{`${rec.avgStars} ★`}</td>
                  <td className="smaller center">{rec.avgRank}</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
      {
        maps[year] &&
        <div className="align-center full-width">
          <iframe src={maps[year]}></iframe>
          <br />
          <small>View <a href={maps[year]} target="_blank">{ year } { config.team } Football Commitments</a> in a larger map</small>
        </div>
      }
    </div>
  );
};