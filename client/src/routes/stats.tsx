import React, { FC, useEffect, useState } from 'react';
import Rest from '../lib/rest-service';
import LocalStorageService from '../lib/local-storage-service';
import { StatsTable } from '../components/StatsTable';
import { Expandable } from '../components/Expandable';
import { SegmentedControl } from '../components/SegmentedControl';
import { Toggle } from '../components/Toggle';
import { CSSTransitionGroup } from 'react-transition-group';
import config from '../config';

const years: number[] = [];
const reverseYears: number[] = [];
const currentYear = new Date().getFullYear();
const conferences: any[] = LocalStorageService.get('conferences') || [];
for (let i = currentYear; i >= config.firstSeason; i--) {
  reverseYears.push(i);
  years.unshift(i);
}

const buildOptions = (confs) => {
  let opts: any = {
    conferenceTeams: [],
    conferences: [],
    currentMembers: [],
    defunct: [
      { value: 'Conf: Big East', label: 'Big East' },
      { value: 'Conf: Big 8', label: 'Big 8' },
      { value: 'Conf: Big West', label: 'Big West' },
      { value: 'Conf: Border', label: 'Border Conference' },
      { value: 'Conf: Gulf States', label: 'Gulf States Conference' },
      { value: 'Conf: Metro', label: 'Metro Conference' },
      { value: 'Conf: MVC', label: 'Missouri Valley Conference' },
      { value: 'Conf: SIAA', label: 'SIAA' },
      { value: 'Conf: Southern', label: 'Southern Conference' },
      { value: 'Conf: SWC', label: 'SWC' },
      { value: 'Conf: WAC', label: 'WAC' }
    ]
  }

  confs.forEach(c => {
    opts.conferenceTeams.push({
      label: c.conference,
      options: c.members.map(m => { return { label: m, value: m } })
    });
    opts.currentMembers.push({ value: `Current ${c.conference}`, label: `Current ${c.conference}` });
    opts.conferences.push({ value: `Conf: ${c.conference}`, label: c.conference });
  });

  return opts;
};

interface IStatsViewProps {
  toggleUserAttend: Function;
  user: any;
}

export const StatsView: FC<IStatsViewProps> = (props) => {

    const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
    const [showSelectTeams, setShowSelectTeams] = useState(false);
    const [startYear, setStartYear] = useState(config.firstSeason);
    const [endYear, setEndYear] = useState(currentYear);
    const [games, setGames] = useState([]);
    const [options, setOptions] = useState<any>({});
    const [homeAwayNeutral, setHomeAwayNeutral] = useState('');
    const [minTeamScore, setMinTeamScore] = useState(20);
    const [minOppScore, setMinOppScore] = useState(20);
    const [maxTeamScore, setMaxTeamScore] = useState(20);
    const [maxOppScore, setMaxOppScore] = useState(20);
    const [teamSearch, setTeamSearch] = useState('');
    const [minTeamScoreEnabled, setMinTeamScoreEnabled] = useState(false);
    const [minOppScoreEnabled, setMinOppScoreEnabled] = useState(false);
    const [maxTeamScoreEnabled, setMaxTeamScoreEnabled] = useState(false);
    const [maxOppScoreEnabled, setMaxOppScoreEnabled] = useState(false);
    const [submitted, setSubmitted] = useState(false);

  const onKeyDown = (e) => {
    if (e.key === ' ' && e.target.nodeName === 'TR') {
      let btn = e.target.querySelector('.btn');
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        btn.click();
      }
    }
    else if ((e.shiftKey || e.target.nodeName !== 'INPUT')) {
      if (e.key === 'Enter') {
        let btn = document.querySelector('.main.stats .btn.big') as HTMLButtonElement;
        if (btn) {
          e.preventDefault();
          e.stopPropagation();
          btn.click();
        }
      }
    }
  };

  const onKeyUp = (e) => {
    if (e.target.nodeName !== 'INPUT') {
      switch (e.key) {
        case '/':
          let input = document.querySelector('.main.stats input') as HTMLInputElement;
          if (input) {
            input.focus();
          }
          break;
        case 'r':
          reset();
          break;
      }
    }
  };

  const onStartYearChange = (e) => {
    setStartYear(parseInt(e.target.value));
  };

  const onEndYearChange = (e) => {
    setEndYear(parseInt(e.target.value));
  };

  const onTeamSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamSearch(e.target.value);
  };

  const toggleTeam = (t) => {
    let teams = [ ...selectedTeams ];
    let i = teams.indexOf(t);
    if (i === -1) {
      teams.push(t);
    }
    else {
      teams.splice(i, 1);
    }
    setSelectedTeams(teams);
  };

  const toggleGroup = (e) => {
    let unchecked = e.target.parentElement.querySelectorAll('input[type=checkbox]:not(:checked)') as NodeList;
    if (unchecked.length > 0) {
      Array.from(unchecked).forEach((item: Node) => (item as HTMLInputElement).click());
    }
    else {
      let checked = e.target.parentElement.querySelectorAll('input[type=checkbox]') as NodeList;
      Array.from(checked).forEach((item: Node) => (item as HTMLInputElement).click());
    }
  };

  const toggleAttend = (id) => {
    Rest.post(`updateAttendance/${id}`).then(() => {
      props.toggleUserAttend(id);
    });
  };

  const reset = () => {
    setShowSelectTeams(false);
    setGames([]);
    setSubmitted(false);
  };

  const openSelectTeams = () => {
    setShowSelectTeams(true);
  };

  const closeSelectTeams = () => {
    setShowSelectTeams(false);
  };

  const submit = (e) => {
    e.preventDefault();
    let start = startYear;
    let end = endYear;
    let teams: string[] = [];
    let confs: string[] = [];
    let curr: string[] = [];
    let han = homeAwayNeutral;

    for (let i = 0; i < selectedTeams.length; i++) {
      let team = selectedTeams[i];

      if (team.indexOf('Conf: ') !== -1) {
        confs.push(team.replace('Conf: ', ''));
      } else if (team.indexOf('Current ') !== -1) {
        curr.push(team.replace('Current ', ''));
      } else {
        teams.push(team);
        if (team === 'ALL-OPP') {
          confs = [];
          curr = [];
          break;
        }
      }
    }

    let query = {
      startYear,
      endYear,
      teams,
      confs,
      homeAwayNeutral,
      minTeamScore: minTeamScoreEnabled ? minTeamScore : null,
      maxTeamScore: maxTeamScoreEnabled ? maxTeamScore : null,
      minOppScore: minOppScoreEnabled ? minOppScore : null,
      maxOppScore: maxOppScoreEnabled ? maxOppScore : null
    };

    Rest.post('statsByopponent', query).then(res => {
      setGames(res);
      setSubmitted(true);
      requestAnimationFrame(() => {
        let el = document.querySelector('hr');
        if (el) {
          el.scrollIntoView(true);
        }
      });
    });
  };

  const onHANChange = (han) => {
    if (homeAwayNeutral === han) {
      setHomeAwayNeutral('');
    }
    else {
      setHomeAwayNeutral(han);
    }
  };

  const toggleMinTeamScore = () => {
    setMinTeamScoreEnabled(!minTeamScoreEnabled);
  };

  const toggleMaxTeamScore = () => {
    setMaxTeamScoreEnabled(!maxTeamScoreEnabled);
  };

  const toggleMinOppScore = () => {
    setMinOppScoreEnabled(!minOppScoreEnabled);
  };

  const toggleMaxOppScore = () => {
    setMaxOppScoreEnabled(!maxOppScoreEnabled);
  };

  const onMinTeamScoreChange = (e) => {
    setMinTeamScore(e.target.value);
  };

  const onMaxTeamScoreChange = (e) => {
    setMaxTeamScore(e.target.value);
  };

  const onMinOppScoreChange = (e) => {
    setMinOppScore(e.target.value);
  };

  const onMaxOppScoreChange = (e) => {
    setMaxOppScore(e.target.value);
  };

  useEffect(() => {
    Rest.get('conferences').then(confs => {
      if (JSON.stringify(confs) !== JSON.stringify(conferences)) {
        LocalStorageService.set('conferences', confs);
      }
      setOptions(buildOptions(confs));
    });

    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('keydown', onKeyDown, true);

    () => {
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('keydown', onKeyDown, true);
    }
  }, []);

  let classes = submitted ? 'main stats submitted' : 'main stats';
  let selectTeamsModal;

  const submittedSection = submitted ? (
    <div className="show-submitted full-width">
      <h3 className="no-margin-top color-primary">vs.</h3>
      <h2 className="color-primary">{selectedTeams.join(', ')}</h2>
      <h3 className="align-center no-margin-top color-tertiary">{`${startYear} – ${endYear}`}</h3>
      <div className="form-group flex-col">
        <button className="btn big center" onClick={() => reset()}>Back</button>
      </div>
      { games.length > 0 ? <hr /> : null }
      { games.length > 0 ?
        <StatsTable
          games={games}
          user={props.user}
          currentYear={currentYear}
          config={config}
          toggleUserAttend={toggleAttend}
          showRecord={true}
        /> : <h2 className="align-center">No results Found 😞</h2>
      }
    </div>
  ) : [];

  if (showSelectTeams) {
    let lowerSearch = teamSearch ? teamSearch.toLowerCase() : null;
    let conferences = options.conferenceTeams.map(c => {
      let options = c.options.filter(opt => opt.label.toLowerCase() !== config.team.toLowerCase() && (!lowerSearch || opt.label.toLowerCase().indexOf(lowerSearch) !== -1))
        .map(opt => {
          return (
            <li key={opt.value} className="item">
              <input type="checkbox" checked={selectedTeams.indexOf(opt.value) !== -1} id={`team-${opt.value}`} onChange={() => toggleTeam(opt.value)} />
              <label htmlFor={`team-${opt.value}`}>
                <div className={`team-logo logo-${ opt.value.replace(/\s+/g, '').replace(/&/g, '').replace(/\./g, '') }`}></div>
                <span>{ opt.label }</span>
              </label>
            </li>
          );
      });

      if (options.length > 0) {
        return (
          <ul key={c.label} className="group">
            <li className="item header" onClick={(e) => toggleGroup(e)}>{c.label}</li>
            { options }
          </ul>
        );
      }
    });

    let conferenceOptions = options.conferences.filter(opt => !lowerSearch || opt.label.toLowerCase().indexOf(lowerSearch) !== -1)
      .map(opt => {
        return (
          <li key={opt.value} className="item">
            <input type="checkbox" id={`conf-${opt.value}`} onClick={() => toggleTeam(opt.value)} />
            <label htmlFor={`conf-${opt.value}`}>{ opt.label }</label>
          </li>
        );
      });

    let currentOptions = options.conferences.filter(opt => !lowerSearch || opt.label.toLowerCase().indexOf(lowerSearch) !== -1)
      .map(opt => {
        return (
          <li key={opt.value} className="item">
            <input type="checkbox" id={`conf-${opt.value}`} onClick={() => toggleTeam(opt.value)} />
            <label htmlFor={`conf-${opt.value}`}>{ opt.label }</label>
          </li>
        );
      });

    let defunctOptions = options.defunct.filter(opt => !lowerSearch || opt.label.toLowerCase().indexOf(lowerSearch) !== -1)
      .map(opt => {
        return (
          <li key={opt.value} className="item">
            <input type="checkbox" id={`conf-${opt.value}`} onClick={() => toggleTeam(opt.value)} />
            <label htmlFor={`conf-${opt.value}`}>{ opt.label }</label>
          </li>
        );
      });

    let otherCategories = (
      <div className="lists">
        { conferenceOptions.length > 0 ?
          <ul className="group">
            <li className="item header">Conference (at time of game)</li>
            { conferenceOptions }
          </ul>
          : null
        }
        { currentOptions.length > 0 ?
          <ul className="group">
            <li className="item header">Conference (current)</li>
            { currentOptions }
          </ul>
          : null
        }
        { defunctOptions.length > 0 ?
          <ul className="group">
            <li className="item header">Defunct Conferences</li>
            { defunctOptions }
          </ul>
          : null
        }
        <ul className="group">
          <li className="item header">Other</li>
          <li className="item">
            <input type="checkbox" id="conf-ALL-OPP" onClick={() => toggleTeam('ALL-OPP')} />
            <label htmlFor="conf-ALL-OPP">All Opponents</label>
          </li>
          <li className="item">
            <input type="checkbox" id="conf-fcs" onClick={() => toggleTeam('Conf: FCS')} />
            <label htmlFor="conf-fcs">FCS</label>
          </li>
        </ul>
      </div>
    );

    selectTeamsModal = (
      <div key={1}>
        <div className="modal-backdrop"></div>
        <div className="modal scale-in select-teams">
          <div className="modal-header">
            <h2>Select Teams</h2>
            <div className="search-wrapper">
              <input type="search" autoFocus value={teamSearch} onChange={onTeamSearchChange} />
            </div>
            <button className="dismiss-btn" onClick={closeSelectTeams}>&times;</button>
          </div>
          <div className="modal-body flex">
            <div className="flex-col">
              <div className="checklist">
                <div className="set">
                  <div className="lists">{ conferences }</div>
                </div>
                <div className="set">
                  <h3 className="set-header">Other Categories</h3>
                  { otherCategories }
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer flex">
            <button className="btn big primary" onClick={closeSelectTeams}>Done</button>
          </div>
        </div>
      </div>
    );
  }
  else {
    selectTeamsModal = [];
  }

  let selectTeamBtn, selectedTeamNames;

  if (selectedTeams.length === 0) {
    selectTeamBtn = (
      <button className="btn big primary" onClick={openSelectTeams}>Select Team(s)</button>
    );
  }
  else {
    selectTeamBtn = (
      <button className="btn primary max-width-200" onClick={openSelectTeams}>Change Selected Teams</button>
    );

    selectedTeamNames = <h2 className="color-primary">{selectedTeams.join(', ')}</h2>;
  }

  return (
    <div className={ classes }>
      <div className="top-block">
        <h1>{ config.team } Football results</h1>
      </div>
      <div className="form-group flex-col hide-submitted flex-center">
        <label>Show me { config.team }&apos;s games against:</label>
        { selectedTeamNames }
        { selectTeamBtn }
      </div>
      <div className="form-group flex-col hide-submitted">
        <label>From</label>
        <select className="big-select margin-bottom-1rem" onChange={onStartYearChange} value={startYear}>
          {
            years.map(y => <option key={y} value={y}>{y}</option>)
          }
        </select>
      </div>
      <div className="form-group flex-col hide-submitted">
        <label>To</label>
        <select className="big-select margin-bottom-1rem" onChange={onEndYearChange} value={endYear}>
          {
            reverseYears.map(y => <option key={y} value={y}>{y}</option>)
          }
        </select>
      </div>
      <div className="hide-submitted margin-bottom-1rem">
        <Expandable title="Narrow it down more?..." defaultCollapsed small centered>
          <div className="more-options">
            <div className="form-group flex-col hide-submitted flex-center">
              <label>Game Locations:</label>
              <SegmentedControl
                options={[
                  { label: 'Home', value: 'H'},
                  { label: 'Away', value: 'A'},
                  { label: 'Neutral', value: 'N'},
                ]}
                value={homeAwayNeutral}
                onChange={(val) => onHANChange(val)}
              />
            </div>
            <hr />
            <div className="form-group flex-col hide-submitted">
              <ul className="criteria-list">
                <li className="flex flex-align-center">
                  <Toggle id="enable-min-team-score" toggled={toggleMinTeamScore} onOff={minTeamScoreEnabled} property="minTeamScoreEnabled" />
                  <label className={!minTeamScoreEnabled ? 'disabled' : ''}>
                    When scoring at least <input type="number" value={minTeamScore} onChange={onMinTeamScoreChange} /> points
                  </label>
                </li>
                <li className="flex flex-align-center">
                  <Toggle id="enable-max-team-score" toggled={toggleMaxTeamScore} onOff={maxTeamScoreEnabled} property="maxTeamScoreEnabled" />
                  <label className={!maxTeamScoreEnabled ? 'disabled' : ''}>
                    When scoring fewer than <input type="number" value={maxTeamScore} onChange={onMaxTeamScoreChange} /> points
                  </label>
                </li>
                <li className="flex flex-align-center">
                  <Toggle id="enable-min-opp-score" toggled={toggleMinOppScore} onOff={minOppScoreEnabled} property="minOppScoreEnabled" />
                  <label className={!minOppScoreEnabled ? 'disabled' : ''}>
                    When opponent scores at least <input type="number" value={minOppScore} onChange={onMinOppScoreChange} /> points
                  </label>
                </li>
                <li className="flex flex-align-center">
                  <Toggle id="enable-max-opp-score" toggled={toggleMaxOppScore} onOff={maxOppScoreEnabled} property="maxOppScoreEnabled" />
                  <label className={!maxOppScoreEnabled ? 'disabled' : ''}>
                    When opponent scores fewer than <input type="number" value={maxOppScore} onChange={onMaxOppScoreChange} /> points
                  </label>
                </li>
              </ul>
            </div>
          </div>
        </Expandable>
      </div>
      <div className="form-group flex-col hide-submitted">
        <button className="btn big primary" onClick={submit}>Submit</button>
      </div>
      <CSSTransitionGroup
        className="full-width"
        transitionName="slide-up-half"
        transitionAppear={true}
        transitionLeave={true}
        transitionEnter={true}
        transitionAppearTimeout={0}
        transitionEnterTimeout={0}
        transitionLeaveTimeout={0}>
        { submittedSection }
      </CSSTransitionGroup>
      <CSSTransitionGroup
        className="full-width"
        transitionName="modal-pop-in"
        transitionAppear={true}
        transitionLeave={true}
        transitionEnter={true}
        transitionAppearTimeout={150}
        transitionEnterTimeout={150}
        transitionLeaveTimeout={150}>
        { selectTeamsModal }
      </CSSTransitionGroup>
    </div>
  );
};