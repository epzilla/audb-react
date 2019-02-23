import React, { FC, useState, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Avatar } from './Avatar';
import { createBrowserHistory } from 'history';
import config from '../config';
import { UserContext } from './App';

const history = createBrowserHistory();

interface IHeaderProps {
  menu?: boolean;
  menuToggledCallback: (menu: boolean) => void;
  showKeyboardShortcuts: () => void;
}

export const Header: FC<IHeaderProps> = ({ menu, menuToggledCallback, showKeyboardShortcuts }) => {
  const user = useContext<any>(UserContext);
  const [showMenu, setShowMenu] = useState(menu);
  const [kb, setKb] = useState(false);
  const [dropdownActive, setDropdownActive] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
    menuToggledCallback(!showMenu);
  };

  const handleDropdownFocus = () => {
    if (window.matchMedia('(min-width: 800px)').matches) {
      setDropdownActive(true);
    }
  };

  const handleDropdownBlur = (e) => {
    if (window.matchMedia('(min-width: 800px)').matches && (!e.relatedTarget || !e.relatedTarget.classList.contains('dropdown-focusable'))) {
      setDropdownActive(false);
    }
  };

  const handleProfileHeaderClick = () => {
    if (window.matchMedia('(max-width: 800px)').matches) {
      history.push('/profile');
    }
  };

  let rightBlock;
  let backdropClass = 'nav-modal-backdrop';
  if (showMenu) {
    backdropClass += ' show';
  }

  if (user) {
    rightBlock = (
      <div className="flex flex-pull-right order-first-smaller" onClick={() => handleProfileHeaderClick()}>
        <div className="dropdown-wrapper larger">
          <div className="dropdown-header faux-link"
            tabIndex={7}
            onFocus={handleDropdownFocus}
            onBlur={handleDropdownBlur}
          >
            <Avatar avatar={user.avatar} />
            <span>{user.name}</span>
          </div>
          <ul className={dropdownActive ? 'dropdown-list active' : 'dropdown-list'}>
            <li className="dropdown-focusable" tabIndex={8} onClick={() => setDropdownActive(false)}>
              <span className="dropdown-focusable" onClick={showKeyboardShortcuts}>Keyboard Shortcuts</span>
            </li>
            <li className="dropdown-focusable" tabIndex={9} onClick={() => setDropdownActive(false)}>
              <Link className="dropdown-focusable" to="/profile" onClick={() => setDropdownActive(false)}>Profile</Link>
            </li>
            <li className="dropdown-focusable" tabIndex={10} onClick={() => setDropdownActive(false)}>
              <Link className="dropdown-focusable" to="/logout">Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
  else {
    rightBlock = (
      <div className="flex flex-pull-right linkify-children">
        <span className="faux-link larger" onClick={showKeyboardShortcuts}>Keyboard Shortcuts</span>
        <Link to="/login">Login</Link>
      </div>
    );
  }

  return (
    <header className="header">
      <button className="btn menu-btn" onClick={toggleMenu}>Menu</button>
      <NavLink className="flex-pull-right" to="/" tabIndex={1}><h1>{config.siteName}</h1></NavLink>
      <nav className={showMenu ? 'show' : 'hide'}>
        <NavLink to="/stats" tabIndex={2} >Stats</NavLink>
        <NavLink to="/yearly" tabIndex={3}>Yearly Results</NavLink>
        <NavLink to="/depth" tabIndex={4}>Depth Chart</NavLink>
        <NavLink to="/recruiting" tabIndex={5} >Recruiting</NavLink>
        {user && user.role && user.role === 'admin' ? <NavLink to="/admin" tabIndex={6}>Admin</NavLink> : null}
        {rightBlock}
        {user ? <Link className="smaller order-last-smaller" to="/logout">Logout</Link> : null}
      </nav>
      <div className={backdropClass} onClick={toggleMenu}></div>
    </header>
  );
}
