import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Swal from 'sweetalert2';

import { startChecking, startLogin, startRegister } from '../../actions/auth';
import * as fetchModule from '../../helpers/fetch';
import { types } from '../../types/types';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const initState = {};
let store = mockStore(initState);

Storage.prototype.setItem = jest.fn();
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

describe('Pruebas en las acciones Auth', () => {

  beforeEach(() => {
    store = mockStore(initState);
    jest.clearAllMocks();
  });
  
  test('startLogin correcto', async () => {
    await store.dispatch(startLogin('arturo@gmail.com', '123456'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      type: types.authLogin,
      payload: {
        uid: expect.any(String),
        name: expect.any(String),
      },
    });
    expect(localStorage.setItem).toHaveBeenCalledWith('token', expect.any(String));
    expect(localStorage.setItem).toHaveBeenCalledWith('token-init-date', expect.any(Number));
  });

  test('startLogin incorrecto', async () => {
    await store.dispatch(startLogin('wrong@gmail.com', '123456'));
    const actions = store.getActions();

    expect(actions.length).toBe(0);
    expect(Swal.fire).toHaveBeenCalled();
  });

  test('startRegister correcto', async () => {
    const uid = '123';
    const name = 'Test';
    const token = 'ABC123';
    fetchModule.fetchSinToken = jest.fn(() => ({
      json() {
        return {
          ok: true,
          uid,
          name,
          token,
        };
      },
    }));

    await store.dispatch(startRegister('test@test.com', '123456', 'Test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      type: types.authLogin,
      payload: {
        uid,
        name,
      },
    });
    expect(localStorage.setItem).toHaveBeenCalledWith('token', token);
    expect(localStorage.setItem).toHaveBeenCalledWith('token-init-date', expect.any(Number));
  });
  
  test('startChecking correcto', async () => {
    const uid = '123';
    const name = 'Test';
    const token = 'ABC123';
    fetchModule.fetchConToken = jest.fn(() => ({
      json() {
        return {
          ok: true,
          uid,
          name,
          token,
        };
      },
    }));

    await store.dispatch(startChecking());
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      type: types.authLogin,
      payload: {
        uid,
        name,
      },
    });
    expect(localStorage.setItem).toHaveBeenCalledWith('token', token);
  });

});
