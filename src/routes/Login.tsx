import React, { FC, useState, useRef, useContext } from 'react';
import Rest from '../lib/rest-service';
import { Link, Redirect } from 'react-router-dom';
import LocalStorageService from '../lib/local-storage-service';
import config from '../config';
import { UserContext } from '../components/App';

interface ILoginProps {
  returnUrl?: string;
  loginCb?: Function;
}

export const Login: FC<ILoginProps> = (props) => {
  const user = useContext(UserContext);
  const { returnUrl, loginCb } = props;
  if (user) {
    let redirect = returnUrl ? returnUrl : '';
    return <Redirect to={`/${redirect}`} />;
  }

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    Rest.post('session', {
      email: emailRef && emailRef.current ? emailRef.current.value : '',
      password: passwordRef && passwordRef.current ? passwordRef.current.value : ''
    }).then(user => {
      LocalStorageService.set('user', user);
      if (loginCb) {
        loginCb(user);
      }

      let redirect = (props && returnUrl) ? returnUrl : '';
      window.location.assign(`/${redirect}`);
    }).catch(e => setError(e));
  };

  return (
    <div className="main login">
      <h1>Login</h1>
      <form name="form" onSubmit={onSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input ref={emailRef} type="email" name="email" autoFocus placeholder={config.loginPlaceholderEmail} className="form-control" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input ref={passwordRef} type="password" name="password" placeholder={config.loginPlaceholderPW} className="form-control" />
        </div>
        {
          error &&
          <div className="form-group has-error">
            <p className="help-block">{error}</p>
          </div>
        }
        <button type="submit" className="btn primary"> Sign in </button><span className="clearfix"></span>
      </form>
      <div className="row pad-mobile">
        <hr />
        Not registered? <Link to="/sign-up" className="text-center new-account">Create an account.</Link>
      </div>
    </div>
  );
};