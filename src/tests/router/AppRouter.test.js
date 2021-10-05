// React, redux imports
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

// Components
import { AppRouter } from '../../router/AppRouter';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Pruebas en <AppRouter />', () => {
  
  test('debe de mostrar el espere...', () => {
    const initState = {
      auth: {
        checking: true,
        uid: '123',
      },
    };
    let store = mockStore(initState);
    store.dispatch = jest.fn();
    
    const wrapper = mount(
      <Provider store={ store }>
        <AppRouter />
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
  });

  test('debe de mostrar la ruta pública', () => {
    const initState = {
      auth: {
        checking: false,
        uid: null,
      },
    };
    let store = mockStore(initState);
    store.dispatch = jest.fn();

    const wrapper = mount(
      <Provider store={ store }>
        <AppRouter />
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('.login-container').exists()).toBeTruthy();
  });

  test('debe de mostrar la ruta privada', () => {
    const initState = {
      auth: {
        checking: false,
        uid: '123',
        name: 'Arturo'
      },
      calendar: {
        events: [],
        activeEvent: null,
      },
      ui: {
        modalOpen: false,
      },
    };
    let store = mockStore(initState);
    store.dispatch = jest.fn();

    const wrapper = mount(
      <Provider store={ store }>
        <AppRouter />
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('.calendar-screen').exists()).toBeTruthy();
  });

});
