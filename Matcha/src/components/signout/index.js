import React from 'react';
import Button from '@material-ui/core/Button';
import { withFirebase } from '../firebase';

const SignOutButton = ({ firebase }) => (
  <Button type="button" onClick={firebase.doSignOut}>
    Sign Out
  </Button>
);

export default withFirebase(SignOutButton);
