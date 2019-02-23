import React from 'react';
import Rest from '../lib/rest-service';
import LocalStorageService from '../lib/local-storage-service';

export const Logout = (props) => {
  let redirect = props.returnUrl ? props.returnUrl : '';
  Rest.del('session').then(() => {
    LocalStorageService.delete('user');
    window.location.assign(`/${redirect}`);
  });
  return null;
};