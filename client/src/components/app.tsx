import React, { Component } from 'react';
import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import Config from '../config';
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
import { KeyboardShortcutHelp } from './KeyboardShortcutHelp';
import Rest from '../lib/rest-service';
import LocalStorageService from '../lib/local-storage-service';
import config from '../config';
import '../style/index.scss';

export const UserContext = React.createContext(null);

interface IAppState {
  user: any;
  menu: boolean;
  games: any[];
  kb: boolean;
}

export default class App extends Component<{}, IAppState> {
  constructor(props) {
    super(props);
    this.ls = LocalStorageService;
    this.state = { user: this.ls.get('user'), menu: false, games: [], kb: false };
    this.config = Config;

    let conf = this.ls.get('config');
    this.config = Config || conf;
    if (Config && JSON.stringify(conf) !== JSON.stringify(Config)) {
      this.ls.set('config', Config);
    }
  }

  private ls: any;
  private config: any;
  private currentUrl: string;

  componentDidMount() {
    // Set CSS Custom Properties
    if (this.config && this.config.themeProperties) {
      Object.keys(this.config.themeProperties).forEach(key => {
        document.body.style.setProperty(`--${key}`, this.config.themeProperties[key]);
      });
    }

    Rest.get('users/me').then(user => {
      if (JSON.stringify(user) !== JSON.stringify(this.state.user)) {
        this.setState({ user: user });
        this.ls.set('user', user);
      }

      Rest.get(`gamesByUser/${user._id}`).then(games => this.setState({ games }));
    }).catch(e => {
      this.setState({ user: null });
    });
  }

  onLogin = (user) => {
    this.setState({ user });
    this.ls.set('user', user);
  };

  onLogout = (returnUrl) => {
    this.setState({ user: null });
    this.ls.delete('user');
    if (returnUrl) {
      this.currentUrl = returnUrl;
      return <Redirect to={returnUrl} />;
    }
  };

  toggleUserAttend = (gameId) => {
    let gameIndex = this.state.user.games.indexOf(gameId);
    let user = this.state.user;
    if (gameIndex === -1) {
      user.games.push(gameId);
    }
    else {
      user.games.splice(gameIndex, 1);
    }

    this.setState({ user });
  };

  menuToggledCallback = (menu) => {
    this.setState({ menu });
  };

  hideKeyboardShortcuts = () => {
    this.setState({ kb: false });
  };

  showKeyboardShortcuts = () => {
    this.setState({ kb: true });
  };

  toggleKeyboardShortcuts = () => {
    this.setState({ kb: !this.state.kb });
  };

  escapeKeyCallback = () => {
    if (this.state.kb) {
      this.hideKeyboardShortcuts();
    }
  };

  updateAvatar = (av) => {
    let user = this.state.user;
    user.avatar = av;
    this.ls.set('user', user);
    this.setState({ user });
  };

  render() {
    return (
      <UserContext.Provider value={this.state.user}>
          <div id="app">
            <Header
              menu={this.state.menu}
              menuToggledCallback={this.menuToggledCallback}
              showKeyboardShortcuts={this.showKeyboardShortcuts}
            />
            <Route path="/" exact render={(props) => <Home games={this.state.games} config={config} />} />
            <Route path="/yearly" render={(props) => <YearlyResultsView toggleUserAttend={this.toggleUserAttend} />} />
            <Route path="/depth" component={Depth} />
            <Route path="/recruiting" component={RecruitingView} />
            <Route path="/stats" component={StatsView} />
            <Route path="/admin" component={AdminView} />
            <Route path="/login/:returnUrl?" render={(props) => <Login loginCb={this.onLogin} {...props} />} />
            <Route path="/logout/:returnUrl?" render={(props) => <Logout loginCb={this.onLogin} {...props} />} />
            <Route path="/sign-up/:returnUrl?" render={(props) => <Signup loginCb={this.onLogin} {...props} />} />
            <Route path="/profile" render={(props) => <Profile avatarUpdatedCallback={this.updateAvatar} />} />
            <Footer config={config} />
            {/* <NotSoSecretCode menu={menu} /> */}
            <GlobalKeyboardShortcuts
              toggleKeyboardShortcuts={this.toggleKeyboardShortcuts}
              escape={this.escapeKeyCallback}
            />
            <KeyboardShortcutHelp show={this.state.kb} dismiss={this.hideKeyboardShortcuts} />
            <audio preload="auto" id="highlight-sound" src={config.highlightSound} />
            <audio preload="auto" id="secret-sound" src="/assets/secret.wav" />
          </div>
      </UserContext.Provider>
    );
  }
}