// React, redux imports
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Swal from 'sweetalert2';

// Components
import { LoginScreen } from '../../../components/auth/LoginScreen';

// Redux actions
import { startLogin, startRegister } from '../../../actions/auth';

jest.mock('../../../actions/auth', () => ({
  startLogin: jest.fn(),
  startRegister: jest.fn(),
}));
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const initState = {};
let store = mockStore(initState);
store.dispatch = jest.fn();

const wrapper = mount(
  <Provider store={ store }>
    <LoginScreen />
  </Provider>
);

describe('Pruebas en <LoginScreen />', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('debe de mostrarse correctamente', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('debe de llamar el dispatch del login', () => {
    const email = 'arturo@gmail.com';
    const password = '123456';

    wrapper.find('input[name="lEmail"]').simulate('change', {
      target: {
        name: 'lEmail',
        value: email,
      },
    });
    wrapper.find('input[name="lPassword"]').simulate('change', {
      target: {
        name: 'lPassword',
        value: password,
      },
    });
    wrapper.find('form').at(0).prop('onSubmit')({
      preventDefault(){},
    });

    expect(startLogin).toHaveBeenCalledWith(email, password);
  });

  test('No hay registro si las constraseñas son diferentes', () => {
    const password1 = '123456';
    const password2 = '1234567';

    wrapper.find('input[name="rPassword1"]').simulate('change', {
      target: {
        name: 'rPassword1',
        value: password1,
      },
    });
    wrapper.find('input[name="rPassword2"]').simulate('change', {
      target: {
        name: 'rPassword2',
        value: password2,
      },
    });
    wrapper.find('form').at(1).prop('onSubmit')({
      preventDefault(){},
    });

    expect(startRegister).not.toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith('Error', 'Las contraseñas deben de ser iguales', 'error');
  });

  test('Registro con contraseñas iguales', () => {
    const password1 = '123456';
    const password2 = '123456';

    wrapper.find('input[name="rPassword1"]').simulate('change', {
      target: {
        name: 'rPassword1',
        value: password1,
      },
    });
    wrapper.find('input[name="rPassword2"]').simulate('change', {
      target: {
        name: 'rPassword2',
        value: password2,
      },
    });
    wrapper.find('form').at(1).prop('onSubmit')({
      preventDefault(){},
    });

    expect(Swal.fire).not.toHaveBeenCalled();
    expect(startRegister).toHaveBeenCalled();
  });

});
