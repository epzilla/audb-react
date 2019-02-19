import { h, Component } from 'react';
import Rest from '../lib/rest-service';
import { route } from 'react-router';
import LocalStorageService from '../lib/local-storage-service';

const Logout = (props) => {
  let redirect = props.returnUrl ? props.returnUrl : '';
  Rest.del('session').then(() => {
    LocalStorageService.delete('user');
    window.location.assign(`/${redirect}`);
  });
};

export default Logout;