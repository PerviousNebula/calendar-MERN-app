import Swal from 'sweetalert2';

import { fetchConToken } from '../helpers/fetch';
import { prepareEvents } from '../helpers/prepareEvents';
import { types } from '../types/types';

export const eventStartAddNew = (event) => {
  return async (dispatch, getState) => {
    const { uid, name } = getState().auth;
    try {
      const resp = await fetchConToken('events', event, 'POST');
      const body = await resp.json();

      if (body.ok) {
        event.id = body.eventoGuardado.id;
        event.user = {
          _id: uid,
          name,
        };
        dispatch(eventAddNew(event));
      }
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  };
};

const eventAddNew = (event) => ({
    type: types.eventAddNew,
    payload: event,
});

export const eventSetActive = (event) => ({
    type: types.eventSetActive,
    payload: event,
});

export const eventClearActiveEvent = () => ({
    type: types.eventClearActiveEvent,
});

export const eventStartUpdate = (event) => {
  return async (dispatch) => {
    try {
      const resp = await fetchConToken(`events/${event.id}`, event, 'PUT');

      if (resp.ok) {
        dispatch(eventUpdated(event));
      } else {
        Swal.fire('Error', resp.statusText, 'error');
      }
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  };
};

const eventUpdated = (event) => ({
    type: types.eventUpdate,
    payload: event,
});

export const eventStartDelete = () => {
  return async (dispatch, getState) => {
    try {
      const { id } = getState().calendar.activeEvent;
      const resp = await fetchConToken(`events/${id}`, {}, 'DELETE');

      if (resp.ok) {
        dispatch(eventDeleted());
      } else {
        Swal.fire('Error', resp.statusText, 'error');
      }
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  };
};

const eventDeleted = () => ({
    type: types.eventDeleted,
});

export const eventStartLoading = () => {
  return async (dispatch) => {
    try {
      const resp = await fetchConToken('events');
      const body = await resp.json();
      const events = prepareEvents(body.eventos);
  
      dispatch(eventLoaded(events));
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  };
};

const eventLoaded = (events) => ({
  type: types.eventLoaded,
  payload: events,
});

export const eventsClearLogout = () => ({
  type: types.eventClearLogout,
});
