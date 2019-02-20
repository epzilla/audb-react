import React, { FC, useState, useRef } from 'react';
import Rest from '../lib/rest-service';
import { Link } from 'react-router-dom';
import { Avatar } from '../components/Avatar';
import LocalStorageService from '../lib/local-storage-service';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

interface IProfileProps {
  user: any;
}

export const Profile: FC<IProfileProps> = (props) => {
  if (!props || !props.user) {
    history.push('/');
  }

  const { user } = props;
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
      email: emailRef.current.value,
      oldpassword: oldpasswordRef.current.value,
      password: passwordRef.current.value,
      password2: password2Ref.current.value
    };
    Rest.put('users', editedUser).then(user => {
      delete editedUser['oldpassword'];
      delete editedUser['password'];
      delete editedUser['password2'];
      LocalStorageService.set('user', editedUser);
      setPassword(null);
      setPassword2(null);
      setOldpassword(null);
    }).catch(err => {
      console.error(err);
    });
  };

  return (
    <div className="main user-profile">
      <div className="user-header-row">
        <Avatar avatar={avatar} avatarUpdatedCallback={setAvatar} big editable />
        <h1>{user.name}</h1>
      </div>
      <form name="form" onSubmit={submit}>
        <div className="form-group">
          <label>Email</label>
          <input ref={emailRef} type="email" name="email" autoFocus className="form-control" value={email} />
        </div>
        <div className="form-group">
          <label>Old Password</label>
          <input ref={oldpasswordRef} type="password" name="oldpassword" className="form-control" value={oldpassword} />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input ref={passwordRef} type="password" name="password" className="form-control" value={password} />
        </div>
        <div className="form-group">
          <label>Re-type New Password</label>
          <input ref={password2Ref} type="password" name="password2" className="form-control" value={password2} />
        </div>          <button type="submit" className="btn primary"> Update </button>
      </form>
    </div>
  );
}
