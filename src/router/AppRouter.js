import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Redirect
} from 'react-router-dom';

import { startChecking } from '../actions/auth';

import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';
import { LoginScreen } from '../components/auth/LoginScreen';
import { CalendarScreen } from '../components/calendar/CalendarScreen';

export const AppRouter = () => {
  const { checking, uid } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(startChecking());
  }, [dispatch]);

  if (checking) {
    return <h5>Espere...</h5>;
  }

  return (
    <Router>
      <div>
        <Switch>
          <PublicRoute
            exact
            component={ LoginScreen }
            path="/login"
            isAuthenticated={ !!uid }
          />
          <PrivateRoute
            exact
            component={ CalendarScreen }
            path="/"
            isAuthenticated={ !!uid }
          />

          <Redirect to="/" />
        </Switch>
      </div>
    </Router>
  )
}
