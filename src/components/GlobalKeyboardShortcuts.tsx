import React, { FC, useRef, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

interface IGlobalKeyboardShortcutsProps {
  toggleKeyboardShortcuts: () => void;
  escape: () => void;
}

export const GlobalKeyboardShortcuts: FC<IGlobalKeyboardShortcutsProps> = (props) => {

  const goTo = useRef(false);
  const [redirectTo, setRedirectTo] = useState('');

  useEffect(() => {
    document.addEventListener('keyup', onKeyUp);
    return () => {
      document.removeEventListener('keyup', onKeyUp);
    }
  });

  useEffect(() => {
    if (redirectTo === window.location.pathname) {
      setRedirectTo('');
    }
  }, [redirectTo]);

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
            setRedirectTo('/');
          }
          break;
        case 's':
          if (goTo.current) {
            goTo.current = false;
            setRedirectTo('/stats');
          }
          break;
        case 'y':
          if (goTo.current) {
            goTo.current = false;
            setRedirectTo('/yearly');
          }
          break;
        case 'd':
          if (goTo.current) {
            goTo.current = false;
            setRedirectTo('/depth');
          }
          break;
        case 'r':
          if (goTo.current) {
            goTo.current = false;
            setRedirectTo('/recruiting');
          }
          break;
        case 'p':
          if (goTo.current) {
            goTo.current = false;
            setRedirectTo('/profile');
          }
        case 'a':
          if (goTo.current) {
            goTo.current = false;
            setRedirectTo('/admin');
          }
        default:
          goTo.current = false;
      }
    }
  };

  if (redirectTo && redirectTo !== window.location.pathname) {
    return <Redirect to={redirectTo} />;
  }

  return null;
};