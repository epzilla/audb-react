import { Component } from 'react';
import { Router } from 'react-router';
import Config from '../config';
import Header from './header';
import Footer from './footer';
import Home from '../routes/home';
import Stats from '../routes/stats';
import Yearly from '../routes/yearly';
import Depth from '../routes/depth';
import Recruiting from '../routes/recruiting';
import Admin from '../routes/admin';
import Login from '../routes/login';
import Logout from '../routes/logout';
import Signup from '../routes/signup';
import Profile from '../routes/profile';
import NotSoSecretCode from './notSoSecretCode';
import GlobalKeyboardShortcuts from './globalKeyboardShortcuts';
import KeyboardShortcutHelp from './keyboardShortcutHelp';
import Rest from '../lib/rest-service';
import LocalStorageService from '../lib/local-storage-service';

export default class App extends Component {
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

  /**
   *  Gets fired when the route changes.
   *  @param {Object} event    "change" event from [react-router](http://git.io/react-router)
   *  @param {string} event.url  The newly routed URL
   */
  handleRoute = e => {
    if ((e.previous && e.previous.indexOf('login') === -1 && e.url.indexOf('login') !== -1) || (e.previous && e.previous.indexOf('logout') === -1 && e.url.indexOf('logout') !== -1)) {
      this.currentUrl = `${e.url}${this.currentUrl}`;
      route(this.currentUrl);
    } else {
      this.currentUrl = e.url;
    }
    this.setState({ menu: false});
  };

  onLogin = (user) => {
    this.setState({ user });
    this.ls.set('user', user);
  };

  onLogout = (returnUrl) => {
    this.setState({ user: null });
    this.ls.delete('user');
    if (returnUrl) {
      this.currentUrl = returnUrl;
      route(returnUrl);
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
      <div id="app">
        <Header
          user={this.state.user}
          menu={this.state.menu}
          config={this.config}
          menuToggledCallback={(e) => this.menuToggledCallback(e)}
          showKeyboardShortcuts={() => this.showKeyboardShortcuts()}
        />
        <Router onChange={(e) => this.handleRoute(e)}>
          <Home path="/" config={this.config} user={this.state.user} games={this.state.games} />
          <Yearly path="/yearly" user={this.state.user} toggleUserAttend={this.toggleUserAttend} config={this.config} />
          <Depth path="/depth" config={this.config} />
          <Recruiting path="/recruiting" config={this.config} />
          <Stats path="/stats" user={this.state.user} toggleUserAttend={this.toggleUserAttend} config={this.config} />
          <Admin path="/admin" user={this.state.user} config={this.config} />
          <Login path="/login/:returnUrl?" user={this.state.user} loginCb={(u) => this.onLogin(u)} config={this.config} />
          <Logout path="/logout/:returnUrl?" config={this.config} />
          <Signup path="/sign-up/:returnUrl?" user={this.state.user} loginCb={(u) => this.onLogin(u)} config={this.config} />
          <Profile path="/profile" user={this.state.user} avatarUpdatedCallback={(av) => this.updateAvatar(av)} />
        </Router>
        <Footer config={this.config} />
        <NotSoSecretCode config={this.config} menu={this.state.menu} />
        <GlobalKeyboardShortcuts
          toggleKeyboardShortcuts={this.toggleKeyboardShortcuts}
          escape={this.escapeKeyCallback}
        />
        <KeyboardShortcutHelp config={this.config} show={this.state.kb} dismiss={() => this.hideKeyboardShortcuts()} />
        <audio preload id="highlight-sound" src={this.config.highlightSound} />
        <audio preload id="secret-sound" src="/assets/secret.wav" />
      </div>
    );
  }
}
