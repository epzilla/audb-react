import React, { FC, useMemo, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
// import d3 from 'd3';
// import crossfilter from 'crossfilter';
// import { PieChart } from '../lib/react-dc/react-dc';
import { StatsTable } from '../components/StatsTable';
import { Expandable } from '../components/Expandable';
import { Avatar } from '../components/Avatar';
import { UserContext } from '../components/App';

interface IHomeProps {
  games: any[];
  config: any;
}

interface IAttendanceRecord {
  w: number;
  l: number;
  t: number;
  confW: number;
  confL: number;
  confT: number;
  total: number;
}

export const Home: FC<IHomeProps> = ({ games, config }) => {
  const user = useContext<any>(UserContext);
  if (!user) {
    let p1 = `This site was created to provide ${config.team} football fans with a quick way to look up
              all-time win/loss records, recruiting info, and the depth chart (with more features
              coming soon). All of that information can be accessed without registering for an account.
              If you do choose to register, you'll get the added benefit of tracking your attendance at
              ${ config.team} games and seeing what your lifetime record is. For games in the past, you can click
              on the "Attended" button on the year-by-year page to register your attendance. And for
              games from here on out, there's a handy checkin function you can use.`;

    let p2 = `So make yourself at home, and if the attendance tracking feature appeals to you,
              go ahead and sign up. It's free, and we'll only send you one welcome email and nothing more.`;

    return (
      <div className="main home">
        <div className="jumbotron">
          <h1>Welcome to {config.siteName}!</h1>
          <p className="lede">{p1}</p>
          <p className="lede">{p2}</p>
          <p className="lede">Enjoy the site, and {config.teamSlogan}!</p>
          <p className="align-center">
            <Link role="button" className="btn big btn-success" to="/sign-up">Sign Up</Link>
          </p>
        </div>
      </div>
    );
  }

  const currentYear = useRef(new Date().getFullYear());
  const calculateRecord = (games) => {
    let record = {
      w: 0,
      l: 0,
      t: 0,
      confW: 0,
      confL: 0,
      confT: 0,
      total: 0
    };

    for (let i = 0; i < games.length; i++) {
      record.total++;
      switch (games[i].result) {
        case 'W':
          record.w++;
          if (games[i].confGame) {
            record.confW++;
          }
          break;
        case 'L':
          record.l++;
          if (games[i].confGame) {
            record.confL++;
          }
          break;
        default:
          record.t++;
          if (games[i].confGame) {
            record.confT++;
          }
      }
    }

    return record;
  };
  let userRecord = useMemo<IAttendanceRecord>(() => calculateRecord(games), [games]);
  // let data = crossfilter(games);
  // let oppDimension = data.dimension(game => game.opponent);
  // let homeDimension = data.dimension(game => {
  //   if (game.homeAwayNeutral === 'H') {
  //     return 'Home';
  //   }
  //   else if (game.homeAwayNeutral === 'A') {
  //     return 'Away';
  //   }
  //   else {
  //     return 'Neutral';
  //   }
  // });
  // let wlDimension = data.dimension(game => {
  //   if (game.result === 'W') {
  //     return 'Win';
  //   } else if (game.result === 'L') {
  //     return 'Loss';
  //   } else {
  //     return 'Tie';
  //   }
  // });
  // let confDimension = data.dimension(game => {
  //   if (game.conference === 'Pac-10') {
  //     return 'Pac-12';
  //   } else if (game.conference === 'Conference-USA') {
  //     return 'Conf-USA';
  //   } else if (game.conference === 'confGameWest') {
  //     return 'confGame (West)';
  //   } else if (game.conference === 'confGameEast') {
  //     return 'confGame (East)';
  //   } else {
  //     return game.conference;
  //   }
  // });

  // let oppGroup = oppDimension.group();
  // let confGroup = confDimension.group();
  // let homeGroup = homeDimension.group();
  // let wlGroup = wlDimension.group();

  return (
    <div className="main home">
      <div className="page-header user-header-row">
        <Avatar avatar={user.avatar} big />
        <div className="flex-col user-profile-stats">
          <h1 className="align-center">{user.name}</h1>
          <h4 className="align-center">Games Attended: {userRecord.w + userRecord.l + userRecord.t}</h4>
          <h4 className="align-center">Record: {userRecord.w}-{userRecord.l}-{userRecord.t} ({userRecord.confW}-{userRecord.confL}-{userRecord.confT})</h4>
        </div>
      </div>
      <StatsTable
        games={games}
        user={user}
        currentYear={currentYear}
        config={config}
        toggleUserAttend={null}
        showRecord={false}
      />
      <hr />
      {/* <Expandable title="Charts" defaultCollapsed centered>
        <div className="row">
          <PieChart dimension={oppDimension} group={oppGroup} height={350} innerRadius={40} externalRadiusPadding={20} minAngleForLabel={0.2} />
        </div>
        <div className="row">
          <PieChart dimension={confDimension} group={confGroup} height={350} innerRadius={40} externalRadiusPadding={20} minAngleForLabel={0.2} />
        </div>
        <div className="row">
          <PieChart dimension={wlDimension} group={wlGroup} height={350} innerRadius={40} externalRadiusPadding={20} />
        </div>
        <div className="row">
          <PieChart dimension={homeDimension} group={homeGroup} height={350} innerRadius={40} externalRadiusPadding={20} minAngleForLabel={0.2} />
        </div>
      </Expandable> */}
    </div>
  );
};