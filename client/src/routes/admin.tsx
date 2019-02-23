import React, { useState, FC, useEffect, useRef } from 'react';
import Rest from '../lib/rest-service';
import LocalStorageService from '../lib/local-storage-service';
import { DepthChart } from '../components/DepthChart';
import { EditablePlayerSlideOut } from '../components/EditablePlayerSlideout';
import { InactivePlayersTable } from '../components/InactivePlayersTable';
import { Expandable } from '../components/Expandable';
import { EditableTable } from '../components/EditableTable';
import { CSSTransitionGroup } from 'react-transition-group';
import { createBrowserHistory } from 'history';
import config from '../config';

const history = createBrowserHistory();
const positions: string[] = ['QB', 'RB', 'FB', 'TE', 'WR', 'OL', 'DE', 'DT', 'LB', 'CB', 'S', 'K', 'P'];
const truePositions = [
  'QB', 'RB', 'FB', 'TE', 'WR2', 'WR9', 'Slot', 'LT', 'LG', 'C', 'RG', 'RT',
  'WDE', 'SDE', 'NG', 'DT', 'WLB', 'MLB', 'SLB', 'LCB', 'RCB', 'FS', 'SS', 'K', 'P'
];
const states: string[] = [
  'AK', 'AL', 'AR', 'AS', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'GU',
  'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN',
  'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK',
  'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VI', 'VT', 'WA',
  'WI', 'WV', 'WY'
];
const recTableHeaders: any[] = [
  { title: 'First', name: 'fname', type: 'text' },
  { title: 'Last', name: 'lname', type: 'text' },
  { name: 'pos', type: 'select', options: positions },
  { name: 'truePos', title: 'Sub-Pos', type: 'select', options: truePositions },
  { name: 'city', type: 'text' },
  { name: 'state', type: 'select', options: states },
  { title: 'HS', name: 'hs', type: 'text' },
  { name: 'height', type: 'text' },
  { name: 'weight', type: 'number' },
  { title: 'R Rank', name: 'rivalsRank', type: 'number' },
  { title: 'R *', name: 'rivalsStars', type: 'number' },
  { title: 'S Rank', name: 'scoutRank', type: 'number' },
  { title: 'S *', name: 'scoutStars', type: 'number' },
  { title: 'Early?', name: 'earlyEnrollee', type: 'boolean' }
];
const d = new Date();
const currentRecYear = d.getMonth() < 2 ? d.getFullYear() : d.getFullYear() + 1;
const currentYear = d.getFullYear();
const years: number[] = [];
for (let i = currentYear + 2; i >= config.firstSeason; i--) {
  years.push(i);
}
const recYears: number[] = [];
for (let i = currentRecYear + 2; i >= config.firstTrackedRecruitingSeason; i--) {
  recYears.push(i);
}
let conferences: any;

Rest.get('conferences').then(c => {
  conferences = c;
});

interface IAdminViewProps {
  user: any;
}

export const AdminView: FC<IAdminViewProps> = (props) => {
  if (!props.user) {
    history.push('/');
  }
  const [players, setPlayers] = useState<any>({});
  const [recruits, setRecruits] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [playerSlideOut, setPlayerSlideOut] = useState('');
  const [scheduleYear, setScheduleYear] = useState(currentYear);
  const [recYear, setRecYear] = useState(currentRecYear);
  const [opponentOptions, setOpponentOptions] = useState<any[]>([]);
  const [locationOptions, setLocationOptions] = useState<any[]>([]);
  const [gameTableHeaders, setGameTableHeaders] = useState<any[]>([]);
  const [confirmAction, setConfirmAction] = useState('');
  const [confirmModal, setConfirmModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const refreshCallback = useRef<Function>(() => {});

  useEffect(() => {
    getPlayers();
    getGames(currentYear);
    getRecruits(currentRecYear);


    Promise.all([
      Rest.get('locations'),
      Rest.get('opponents')
    ]).then(([locOptions, oppOptions]) => {
      let gtHeaders: any[] = [
        { name: 'game', type: 'text' },
        { name: 'date', type: 'date' },
        {
          name: 'opponent',
          type: 'autocomplete',
          items: oppOptions.map(o => o.name),
          render: (items) => {
            return items.map(item => {
              let classes = item.highlighted ? 'option highlighted' : 'option';
              return (
                <li className={classes} onClick={() => {}} data-item={item}>
                  <div className={`team-logo logo-${item.val.replace(/\s+/g, '').replace(/&/g, '').replace(/\./g, '')}`}></div>
                  {item.val}
                </li>
              );
            });
          }
        },
        { name: 'teamScore', title: 'Team Score', type: 'number' },
        { name: 'opScore', title: 'Opponent Score', type: 'number' },
        {
          name: 'location',
          type: 'autocomplete',
          items: locOptions,
          render: (items) => {
            return items.map(item => {
              let classes = item.highlighted ? 'option highlighted' : 'option';
              return (
                <li className={classes} onClick={() => {}} data-item={item}>
                  {item.val}
                </li>
              );
            });
          }
        }
      ];

      setOpponentOptions(oppOptions);
      setLocationOptions(locOptions);
      setGameTableHeaders(gtHeaders);
    });
  }, []);

  const getPlayers = async () => {
    let pls = LocalStorageService.get('players');
    if (pls) {
      setPlayers(pls);
    }

    const plsByPos = await Rest.get('playersByPos')
    if (JSON.stringify(pls) !== JSON.stringify(plsByPos)) {
      setPlayers(plsByPos);
      if (refreshCallback.current) {
        refreshCallback.current();
      }
    }
  };

  const getGames = async (year) => {
    const res = await Rest.get(`year/${year}`);
    setGames(res);
  };

  const getRecruits = async (year?) => {
    const res = await Rest.get(`recruits/${year || currentRecYear}`);
    setRecruits(res);
  };

  const showPlayerSlideOut = (player) => {
    setPlayerSlideOut(player);
  };

  const dismissPlayerSlideOut = () => {
    setPlayerSlideOut('');
  };

  const savePlayer = async (player) => {
    await Rest.post(`player/${player._id}`, player);
    getPlayers();
    dismissPlayerSlideOut();
  };

  const swapPlayers = async (player, replacedPlayer, insertFirst, insertLast) => {
    try {
      await Rest.post('posChange', { player, replacedPlayer, insertFirst, insertLast });
      getPlayers();
    }
    catch (e) {
      console.error(e);
    };
  };

  const registerRefreshCallback = (cb) => {
    refreshCallback.current = cb;
  };

  const saveGameRow = async (game) => {
    // We first have to correctly set the conference info, etc.
    let conf = conferences.find(c => c.members.indexOf(game.opponent) !== -1);
    if (conf) {
      game.conference = conf.conference;
      game.currentConf = conf.conference;
      game.majorConf = conf.majorConf;
      game.fbs = conf.fbs;
      game.fcs = conf.fcs;
      game.confGame = conf.conference.indexOf(config.conference) !== -1;
    }
    try {
      await Rest.post('games', game);
      return;
    }
    catch (e) {
      console.error(e);
    }
  };

  const saveRecRow = async (rec, i) => {
    try {
      const recruit = await Rest.post('recruits', rec);
      let recs = [ ...recruits ];
      recs[i] = recruit;
      setRecruits(recs);
    }
    catch (e) {
      console.error(e);
    }
  };

  const setSchedYear = (e) => {
    let schedYear = parseInt(e.target.value);
    setSchedYear(schedYear)
    getGames(schedYear);
  };

  const setRecruitsYear = (e) => {
    let recruitsYear = parseInt(e.target.value);
    setRecYear(recruitsYear)
    getRecruits(recruitsYear);
  };

  const addRecruit = () => {
    let protoRecruit = {
      fname: 'John',
      lname: 'Doe',
      pos: 'QB',
      truePos: 'QB',
      class: recYear,
      city: config.city.slice(0, -4),
      state: config.city.slice(-2),
      hs: config.city.slice(0, -4),
      height: '6-2',
      weight: 200,
      rivalsRank: 25,
      scoutRank: 25,
      rivalsStars: 4,
      scoutStars: 4,
      earlyEnrollee: false
    };
    let recs = [ ...recruits ];
    recs.push(protoRecruit);
    setRecruits(recs);
  };

  const addGame = () => {
    let allGames = [ ...games ];
    let lastGame = allGames[allGames.length - 1];
    let newDate;

    if (lastGame) {
      newDate = new Date(lastGame.date);
      newDate.setDate(newDate.getDate() + 7);
      while (newDate.getDay() !== 6) {
        newDate.setDate(newDate.getDate() + 1);
      }
    }
    else {
      // We must be adding the first game of the season!
      // Let's make a reasonable guess here, starting at the first
      // Saturday on or after August 30th
      newDate = new Date();
      newDate.setFullYear(scheduleYear);
      newDate.setMonth(7);
      newDate.setDate(30);
      while (newDate.getDay() !== 6) {
        newDate.setDate(newDate.getDate() + 1);
      }
    }

    let day = newDate.getDate();
    if (day.toString().length === 1) {
      day = `0${day}`;
    }
    let month = newDate.getMonth() + 1;
    if (month.toString().length === 1) {
      month = `0${month}`;
    }

    let protoGame = {
      season: scheduleYear,
      opponent: opponentOptions[0].name,
      game: lastGame ? lastGame.game + 1 : 1,
      result: 'T',
      date: `${newDate.getFullYear()}-${month}-${day}`,
      homeAwayNeutral: 'H',
      location: config.city,
      teamScore: 0,
      opScore: 0,
      conference: config.conference,
      gameId: lastGame ? lastGame.gameId + 1 : null
    };

    delete protoGame['_id'];
    delete protoGame['__v'];
    allGames.push(protoGame);
    setGames(allGames);
  };

  const deleteGameRow = async (i, deletedGame) => {
    try {
      await Rest.del(`games/${deletedGame._id}`, deletedGame)
      getGames(scheduleYear);
    }
    catch (e) {
      console.error(e);
    }
  };

  const deleteRecRow = async (i, deletedRecruit) => {
    try {
      await Rest.del(`recruit/${deletedRecruit._id}`, deletedRecruit);
      getRecruits(currentRecYear);
    }
    catch (e) {
      console.error(e);
    };
  };

  const maybePerformAction = (action, confText) => {
    setConfirmAction(action);
    setConfirmText(confText);
    setConfirmModal(true);
  };

  const dismissConfirmModal = () => {
    setConfirmAction('');
    setConfirmText('');
    setConfirmModal(false);
  };

  const doConfirmAction = () => {
    switch (confirmAction) {
      case 'fixStringNumbers':
        fixStringNumbers();
        return;
      case 'advancePlayers':
        advancePlayers();
        return;
      case 'enrollEarly':
        enrollEarly();
        return;
      case 'enrollAll':
        enrollAll();
        return;
    }
  };

  const advancePlayers = async () => {
    await Rest.post('advancePlayers')
    getPlayers();
    dismissConfirmModal();
  };

  const enrollEarly = async () => {
    await Rest.post('recruits/enroll?early=true');
    getPlayers();
    getRecruits();
    dismissConfirmModal();
  };

  const enrollAll = async () => {
    await Rest.post('recruits/enroll');
    getPlayers();
    getRecruits();
    dismissConfirmModal();
  };

  const fixStringNumbers = async () => {
    await Rest.post('fixStringNumbers');
    getPlayers();
    dismissConfirmModal();
  };

  let depth, plSlideOut;
  let confModal;

  if (players && playerSlideOut) {
    plSlideOut = <EditablePlayerSlideOut player={playerSlideOut} dismiss={dismissPlayerSlideOut} save={(player) => savePlayer(player)} />;
  }

  if (confirmModal && confirmAction) {
    confModal = (
      <div>
        <div className="modal-backdrop"></div>
        <div className="modal scale-in confirm-modal">
          <div className="modal-header">
            <h2>Are you sure you want to {confirmText}?</h2>
            <button className="dismiss-btn" onClick={dismissConfirmModal}>&times;</button>
          </div>
          <div className="modal-body flex">
            <div className="btn-container">
              <button className="btn primary" onClick={doConfirmAction}>Yes</button>
              <button className="btn" onClick={dismissConfirmModal}>No</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main admin">
      <h1>Admin</h1>

      <CSSTransitionGroup
        transitionName="slide-out"
        transitionAppear={true}
        transitionLeave={true}
        transitionEnter={true}
        transitionEnterTimeout={0}
        transitionLeaveTimeout={0}>
        {plSlideOut || []}
      </CSSTransitionGroup>

      <Expandable title="Edit Depth Chart" defaultCollapsed>
        <DepthChart
          selectedCallback={(player) => showPlayerSlideOut(player)}
          players={players}
          swapPlayers={swapPlayers}
          editable
        />
      </Expandable>

      <hr />

      <Expandable title="Inactive Players" defaultCollapsed>
        <InactivePlayersTable
          playerReactivated={() => getPlayers()}
          registerForRefresh={cb => registerRefreshCallback(cb)}
        />
      </Expandable>

      <hr />

      <Expandable className="flex-center" title="Edit Schedule" defaultCollapsed>
        <select onChange={setSchedYear}>
          {
            years.map(y => {
              return <option value={y} selected={y === scheduleYear}>{y}</option>
            })
          }
        </select>
        <EditableTable
          className="capped-size-table"
          headers={gameTableHeaders}
          data={games || []}
          autoSaveRow={true}
          rowSaveCallback={saveGameRow}
          rowDeleteCallback={deleteGameRow}
          deleteButton
        />
        <button className="btn primary" onClick={addGame}>Add Game</button>
      </Expandable>

      <hr />

      <Expandable className="flex-center" title="Edit Recruits" defaultCollapsed>
        <select onChange={setRecruitsYear}>
          {
            recYears.map(y => {
              return <option value={y} selected={y === recYear}>{y}</option>
            })
          }
        </select>
        <EditableTable
          headers={recTableHeaders}
          data={recruits || []}
          autoSaveRow={true}
          rowSaveCallback={saveRecRow}
          rowDeleteCallback={deleteRecRow}
          deleteButton
        />
        <button className="btn primary" onClick={addRecruit}>Add Recruit</button>
      </Expandable>

      <hr />

      <Expandable title="One-Click Actions" defaultCollapsed>
        <h2>Fix string numbers</h2>
        <button className="btn primary" onClick={() => maybePerformAction('fixStringNumbers', 'Fix String Numbers')}>Fix</button>
        <h2>Advance Players</h2>
        <button className="btn primary" onClick={() => maybePerformAction('advancePlayers', 'Advance Players')}>Advance</button>
        <h2>Enroll Early Recruits</h2>
        <button className="btn primary" onClick={() => maybePerformAction('enrollEarly', 'Enroll all early recruits')}>Enroll</button>
        <h2>Enroll All Recruits</h2>
        <button className="btn primary" onClick={() => maybePerformAction('enrollAll', 'Enroll all recruits')}>Enroll</button>
      </Expandable>

      <CSSTransitionGroup
        className="full-width"
        transitionName="modal-pop-in"
        transitionAppear={true}
        transitionLeave={true}
        transitionEnter={true}
        transitionEnterTimeout={150}
        transitionLeaveTimeout={150}>
        {confModal || []}
      </CSSTransitionGroup>
    </div>
  );
}
