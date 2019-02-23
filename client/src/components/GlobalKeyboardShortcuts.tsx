import React, { FC, useRef, useEffect } from 'react';
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

interface IGlobalKeyboardShortcutsProps {
  toggleKeyboardShortcuts: () => void;
  escape: () => void;
}

export const GlobalKeyboardShortcuts: FC<IGlobalKeyboardShortcutsProps> = (props) => {

  const goTo = useRef(false);

  useEffect(() => {
    document.addEventListener('keyup', onKeyUp);
    return () => {
      document.removeEventListener('keyup', onKeyUp);
    }
  });

  const onKeyUp = (e) => {
    if (e.target.nodeName !== 'INPUT') {
      switch (e.key) {
        case 'k':
          props.toggleKeyboardShortcuts();
          break;
        case 'Escape':
          props.escape();
          break;
        case 'g':
          goTo.current = true;
          break;
        case 'h':
          if (goTo.current) {
            goTo.current = false;
            history.push('/');
          }
          break;
        case 's':
          if (goTo.current) {
            goTo.current = false;
            history.push('/stats');
          }
          break;
        case 'y':
          if (goTo.current) {
            goTo.current = false;
            history.push('/yearly');
          }
          break;
        case 'd':
          if (goTo.current) {
            goTo.current = false;
            history.push('/depth');
          }
          break;
        case 'r':
          if (goTo.current) {
            goTo.current = false;
            history.push('/recruiting');
          }
          break;
        case 'p':
          if (goTo.current) {
            goTo.current = false;
            history.push('/profile');
          }
        case 'a':
          if (goTo.current) {
            goTo.current = false;
            history.push('/admin');
          }
        default:
          goTo.current = false;
      }
    }
  };

  return null;
};