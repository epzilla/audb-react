import React, { FC, useState, useRef, useContext } from 'react';
import Rest from '../lib/rest-service';
import { Link, Redirect } from 'react-router-dom';
import { Avatar } from '../components/Avatar';
import LocalStorageService from '../lib/local-storage-service';
import { createBrowserHistory } from 'history';
import { UserContext } from '../components/App';

const history = createBrowserHistory();

interface IProfileProps {
  avatarUpdatedCallback: Function;
}

export const Profile: FC<IProfileProps> = ({ avatarUpdatedCallback }) => {
  const user = useContext<any>(UserContext);
  if (!user) {
    return <Redirect to={'/'} />;
  }

  const emailRef = useRef<HTMLInputElement>(null);
  const oldpasswordRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const password2Ref = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState(user.avatar);
  const [email, setEmail] = useState(user.email);
  const [oldpassword, setOldpassword] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    let editedUser = {
      ...user,
      avatar,
      email: emailRef && emailRef.current ? emailRef.current.value : '',
      oldpassword: oldpasswordRef && oldpasswordRef.current ? oldpasswordRef.current.value : '',
      password: passwordRef && passwordRef.current ? passwordRef.current.value : '',
      password2: password2Ref && password2Ref.current ? password2Ref.current.value : ''
    };
    Rest.put('users', editedUser).then(user => {
      delete editedUser['oldpassword'];
      delete editedUser['password'];
      delete editedUser['password2'];
      LocalStorageService.set('user', editedUser);
      setPassword('');
      setPassword2('');
      setOldpassword('');
    }).catch(err => {
      console.error(err);
    });
  };

  const onUpdateAvatar = (avi) => {
    setAvatar(avi);
    avatarUpdatedCallback(avi);
  }

  return (
    <div className="main user-profile">
      <div className="user-header-row">
        <Avatar avatar={avatar} avatarUpdatedCallback={onUpdateAvatar} big editable />
        <h1>{user.name}</h1>
      </div>
      <form name="form" onSubmit={submit}>
        <div className="form-group">
          <label>Email</label>
          <input ref={emailRef} type="email" name="email" autoFocus className="form-control" defaultValue={email} />
        </div>
        <div className="form-group">
          <label>Old Password</label>
          <input ref={oldpasswordRef} type="password" name="oldpassword" className="form-control" defaultValue={oldpassword} />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input ref={passwordRef} type="password" name="password" className="form-control" defaultValue={password} />
        </div>
        <div className="form-group">
          <label>Re-type New Password</label>
          <input ref={password2Ref} type="password" name="password2" className="form-control" defaultValue={password2} />
        </div>          <button type="submit" className="btn primary"> Update </button>
      </form>
    </div>
  );
}
