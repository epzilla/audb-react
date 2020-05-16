import React, { FC, useState, useRef, useContext } from 'react';
import Rest from '../lib/rest-service';
import { Link, Redirect } from 'react-router-dom';
import LocalStorageService from '../lib/local-storage-service';
import { createBrowserHistory } from 'history';
import config from '../config';
import { UserContext } from '../components/App';

const history = createBrowserHistory();

interface ISignupProps {
  returnUrl?: string;
  loginCb?: Function;
}

export const Signup: FC<ISignupProps> = (props) => {
  const user = useContext(UserContext);
  const { loginCb, returnUrl } = props;
  if (user) {
    let redirect = returnUrl ? returnUrl : '';
    return <Redirect to={`/${redirect}`} />;
  }

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    Rest.post('users', {
      name: nameRef && nameRef.current ? nameRef.current.value : '',
      email: emailRef && emailRef.current ? emailRef.current.value : '',
      password: passwordRef && passwordRef.current ? passwordRef.current.value : ''
    }).then(user => {
      LocalStorageService.set('user', user);
      if (loginCb) {
        loginCb(user);
      }

      let redirect = (props && returnUrl) ? returnUrl : '';
      return <Redirect to={`/${redirect}`} />;
    }).catch(e =>  setError(e));
  };

  return (
    <div className="main login">
      <h1>Sign Up</h1>
      <form name="form" onSubmit={onSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" autoFocus placeholder={config.signupPlaceholderName} className="form-control" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" placeholder={config.signupPlaceholderEmail} className="form-control" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" placeholder={config.signupPlaceholderPW} className="form-control" />
        </div>
        {
          error &&
          <div className="form-group has-error">
            <p className="help-block">Hmmm... something went wrong. Please try again.</p>
          </div>
        }
        <button type="submit" className="btn primary"> Sign Up </button><span className="clearfix"></span>
      </form>
      <div className="row pad-mobile">
        <hr />
        Already have an account? <Link to="/login" className="text-center new-account">Log in.</Link>
      </div>
    </div>
  );
}
