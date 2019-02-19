import { h, Component } from 'react';
import { route } from 'react-router';
import { Link } from 'react-router/match';
import Avatar from './avatar';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { menu: false, kb: false };
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.menu !== 'undefined') {
      this.setState({ menu: nextProps.menu });
    }
  }

  toggleMenu() {
    this.setState({ menu: !this.state.menu }, () => {
      this.props.menuToggledCallback(this.state.menu);
    });
  }

  handleDropdownFocus = () => {
    if (window.matchMedia('(min-width: 800px)').matches) {
      this.setState({ dropdownActive: true });
    }
  };

  handleDropdownBlur = (e) => {
    if (window.matchMedia('(min-width: 800px)').matches && (!e.relatedTarget || !e.relatedTarget.classList.contains('dropdown-focusable'))) {
      this.setState({ dropdownActive: false });
    }
  };

  handleProfileHeaderClick = () => {
    if (window.matchMedia('(max-width: 800px)').matches) {
      route('/profile');
    }
  };

  render() {
    const user = this.props.user;
    let rightBlock;
    let backdropClass = 'nav-modal-backdrop';
    if (this.state.menu) {
      backdropClass += ' show';
    }

    if (user) {
      rightBlock = (
        <div className="flex flex-pull-right order-first-smaller" onClick={() => this.handleProfileHeaderClick()}>
          <div className="dropdown-wrapper larger">
            <div className="dropdown-header faux-link"
              tabindex="7"
              onFocus={(e) => this.handleDropdownFocus(e)}
              onBlur={(e) => this.handleDropdownBlur(e)}
            >
              <Avatar avatar={ user.avatar } />
              <span>{ user.name }</span>
            </div>
            <ul className={this.state.dropdownActive ? 'dropdown-list active' : 'dropdown-list'}>
              <li className="dropdown-focusable" tabindex="8" onClick={() => this.setState({ dropdownActive: false })}>
                <span className="dropdown-focusable" onClick={this.props.showKeyboardShortcuts}>Keyboard Shortcuts</span>
              </li>
              <li className="dropdown-focusable" tabindex="9" onClick={() => this.setState({ dropdownActive: false })}>
                <Link className="dropdown-focusable" activeClassName="active" href="/profile" onClick={() => this.setState({ dropdownActive: false })}>Profile</Link>
              </li>
              <li className="dropdown-focusable" tabindex="10" onClick={() => this.setState({ dropdownActive: false })}>
                <Link className="dropdown-focusable" activeClassName="active" href="/logout">Logout</Link>
              </li>
            </ul>
          </div>
        </div>
      );
    }
    else {
      rightBlock = (
        <div className="flex flex-pull-right linkify-children">
          <span className="faux-link larger" onClick={this.props.showKeyboardShortcuts}>Keyboard Shortcuts</span>
          <Link activeClassName="active" href="/login">Login</Link>
        </div>
      );
    }

    return (
      <header className="header">
        <button className="btn menu-btn" onClick={this.toggleMenu}>Menu</button>
        <Link className="flex-pull-right" href="/" tabindex="1"><h1>{ this.props.config.siteName }</h1></Link>
        <nav className={this.state.menu ? 'show' : 'hide'}>
          <Link activeClassName="active" href="/stats" tabindex="2">Stats</Link>
          <Link activeClassName="active" href="/yearly" tabindex="3">Yearly Results</Link>
          <Link activeClassName="active" href="/depth" tabindex="4">Depth Chart</Link>
          <Link activeClassName="active" href="/recruiting" tabindex="5">Recruiting</Link>
          { user && user.role && user.role === 'admin' ? <Link activeClassName="active" href="/admin" tabindex="6">Admin</Link> : null }
          { rightBlock }
          { user ? <Link className="smaller order-last-smaller" activeClassName="active" href="/logout">Logout</Link> : null }
        </nav>
        <div className={backdropClass} onClick={this.toggleMenu}></div>
      </header>
    );
  }
}
