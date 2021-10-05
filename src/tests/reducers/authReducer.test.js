import { authReducer } from '../../reducers/authReducer';
import { types } from '../../types/types';

const initState = {
  checking: true,
  uid: null,
  name: null,
};

describe('Pruebas en authReducer', () => {
  
  test('debe de retornar el estado por defecto', () => {
    const state = authReducer(initState, {});
    
    expect(state).toEqual(initState);
  });

  test('debe hacer el login correctamente', () => {
    const uid = '123';
    const name = 'Test';
    const loginAction = {
      type: types.authLogin,
      payload: {
        uid,
        name,
      },
    };
    const state = authReducer(initState, loginAction);

    expect(state).toEqual({
      checking: false,
      uid,
      name,
    });
  });

});
