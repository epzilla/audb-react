import React, { FC, createContext, useEffect, useState, useRef } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { Home } from '../routes/Home';
import { StatsView } from '../routes/Stats';
import { YearlyResultsView } from '../routes/Yearly';
import { Depth } from '../routes/Depth';
import { RecruitingView } from '../routes/Recruiting';
import { AdminView } from '../routes/Admin';
import { Login } from '../routes/Login';
import { Logout } from '../routes/Logout';
import { Signup } from '../routes/Signup';
import { Profile } from '../routes/Profile';
// import { NotSoSecretCode } from './NotSoSecretCode';
import { GlobalKeyboardShortcuts } from './GlobalKeyboardShortcuts';
import { KeyboardShortcutHelp }  from './KeyboardShortcutHelp';
import Rest from '../lib/rest-service';
import LocalStorageService from '../lib/local-storage-service';
import config from '../config';
import { useLocalStorage } from '../lib/hooks';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

export const UserContext = createContext(null);

export const App: FC = (props) => {
  // state = { user: ls.get('user'), menu: false, games: [], kb: false };
  let conf = LocalStorageService.get('config');
  const configuration = config || conf;
  if (config && JSON.stringify(conf) !== JSON.stringify(config)) {
    LocalStorageService.set('config', config);
  }

  const [user, setUser] = useLocalStorage('user', null);
  const [games, setGames] = useState([]);
  const [menu, setMenu] = useState(false);
  const [showKbShortcuts, setShowKbShortcuts] = useState(false);
  const url = useRef('');

  useEffect(() => {
    // Set CSS Custom Properties
    if (config && config.themeProperties) {
      Object.keys(config.themeProperties).forEach(key => {
        document.body.style.setProperty(`--${key}`, config.themeProperties[key]);
      });
    }

    Rest.get('users/me').then(u => {
      if (JSON.stringify(u) !== JSON.stringify(u)) {
        setUser(u);
      }

      return Rest.get(`gamesByUser/${user._id}`);
    })
    .then(g => setGames(g))
    .catch(e => {
      setUser(null);
    });
  }, []);

  /**
   *  Gets fired when the route changes.
   *  @param {Object} event    "change" event from [react-router](http://git.io/react-router)
   *  @param {string} event.url  The newly routed URL
   */
  const handleRoute = (e) => {
    if ((e.previous && e.previous.indexOf('login') === -1 && e.url.indexOf('login') !== -1) || (e.previous && e.previous.indexOf('logout') === -1 && e.url.indexOf('logout') !== -1)) {
      url.current = `${e.url}${url.current}`;
      history.push(url.current);
    } else {
      url.current = e.url;
    }
    setMenu(false);
  };

  const onLogin = (u) => {
    setUser(u);
  };

  const onLogout = (returnUrl) => {
    setUser(null);
    if (returnUrl) {
      url.current = returnUrl;
      history.push(returnUrl);
    }
  };

  const toggleUserAttend = (gameId) => {
    let editedUser = { ...user };
    let gameIndex = editedUser.games.indexOf(gameId);
    if (gameIndex === -1) {
      editedUser.games.push(gameId);
    }
    else {
      editedUser.games.splice(gameIndex, 1);
    }

    setUser(editedUser);
  };

  const menuToggledCallback = (m) => {
    setMenu(m);
  };

  const hideKeyboardShortcuts = () => {
    setShowKbShortcuts(false);
  };

  const showKeyboardShortcuts = () => {
    setShowKbShortcuts(true);
  };

  const toggleKeyboardShortcuts = () => {
    setShowKbShortcuts(!showKbShortcuts);
  };

  const escapeKeyCallback = () => {
    if (showKbShortcuts) {
      hideKeyboardShortcuts();
    }
  };

  const updateAvatar = (av) => {
    let editedUser = { ...user };
    editedUser.avatar = av;
    setUser(editedUser);
  };

  return (
    <UserContext.Provider value={user}>
    <BrowserRouter>
      <div id="app">
        <Header
          menu={menu}
          menuToggledCallback={(e) => menuToggledCallback(e)}
          showKeyboardShortcuts={() => showKeyboardShortcuts()}
        />
        <Route path="/" render={(props) => <Home games={games} config={config} />} />
        <Route path="/yearly" render={(props) => <YearlyResultsView toggleUserAttend={toggleUserAttend} />} />
        <Route path="/depth" component={Depth} />
        <Route path="recruiting" component={RecruitingView} />
        <Route path="stats" component={StatsView} />
        <Route path="admin" component={AdminView} />
        <Route path="/login/:returnUrl?" render={(props) => <Login loginCb={onLogin} {...props} />} />
        <Route path="/logout/:returnUrl?" render={(props) => <Logout loginCb={onLogin} {...props} />} />
        <Route path="/sign-up/:returnUrl?" render={(props) => <Signup loginCb={onLogin} {...props} />} />
        <Route path="/profile" render={(props) => <Profile avatarUpdatedCallback={updateAvatar} />} />
        <Footer config={config} />
        {/* <NotSoSecretCode menu={menu} /> */}
        <GlobalKeyboardShortcuts
          toggleKeyboardShortcuts={toggleKeyboardShortcuts}
          escape={escapeKeyCallback}
        />
        <KeyboardShortcutHelp show={showKeyboardShortcuts} dismiss={hideKeyboardShortcuts} />
        <audio preload="auto" id="highlight-sound" src={config.highlightSound} />
        <audio preload="auto" id="secret-sound" src="/assets/secret.wav" />
      </div>
    </BrowserRouter>
    </UserContext.Provider>
  );
}
