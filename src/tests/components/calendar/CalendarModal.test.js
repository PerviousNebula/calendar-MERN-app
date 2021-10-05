// React, redux imports
import { mount } from 'enzyme';
import moment from 'moment';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Swal from 'sweetalert2';

// Redux actions
import { eventClearActiveEvent, eventStartAddNew, eventStartUpdate } from '../../../actions/events';

// Components
import { CalendarModal } from '../../../components/calendar/CalendarModal';

jest.mock('../../../actions/events', () => ({
  eventStartUpdate: jest.fn(),
  eventClearActiveEvent: jest.fn(),
  eventStartAddNew: jest.fn(),
}));
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const now = moment().minutes(0).seconds(0).add(1, 'hours');
const nowPlus1 = now.clone().add(1, 'hours');
const initState = {
  ui: {
    modalOpen: true,
  },
  calendar: {
    activeEvent: {
      title: 'Hola mundo',
      notes: 'algunas notas',
      start: now.toDate(),
      end: nowPlus1.toDate(),
    },
  },
};
let store = mockStore(initState);
store.dispatch = jest.fn();

const wrapper = mount(
  <Provider store={ store }>
    <CalendarModal />
  </Provider>
);

describe('Pruebas en <CalendarModal />', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe mostrarse correctamente', () => {
    // expect(wrapper.find('.modal').exists()).toBeTruthy();
    expect(wrapper.find('Modal').prop('isOpen')).toBeTruthy();
  });

  test('debe de llamar la acción de actualizar y cerrar modal', () => {
    wrapper.find('form').simulate('submit', {
      preventDefault(){}
    });

    expect(eventStartUpdate).toHaveBeenCalledWith(initState.calendar.activeEvent);
    expect(eventClearActiveEvent).toHaveBeenCalled();
  });

  test('debe de mostrar error si falta el título', () => {
    wrapper.find('form').simulate('submit', {
      preventDefault(){}
    });

    expect(wrapper.find('input[name="title"]').hasClass('is-invalid')).toBeTruthy();
  });

  test('debe de crear un nuevo evento', () => {
    const initState = {
      ui: {
        modalOpen: true,
      },
      calendar: {
        activeEvent: null,
      },
    };
    let store = mockStore(initState);
    store.dispatch = jest.fn();

    const wrapper = mount(
      <Provider store={ store }>
        <CalendarModal />
      </Provider>
    );

    wrapper.find('input[name="title"]').simulate('change', {
      target: {
        name: 'title',
        value: 'Hola pruebas',
      }
    });
    wrapper.find('form').simulate('submit', {
      preventDefault(){}
    });

    expect(eventStartAddNew).toHaveBeenLastCalledWith({
      title: 'Hola pruebas',
      notes: '',
      end: expect.anything(),
      start: expect.anything(),
    });
    expect(eventClearActiveEvent).toHaveBeenCalled();
  });

  test('debe de validar las fechas', () => {
    wrapper.find('input[name="title"]').simulate('change', {
      target: {
        name: 'title',
        value: 'Hola pruebas',
      }
    });
    const today = new Date();

    act(() => {
      wrapper.find('DateTimePicker').at(1).prop('onChange')(today);
    });

    wrapper.find('form').simulate('submit', {
      preventDefault(){}
    });

    expect(Swal.fire).toHaveBeenLastCalledWith('Error', 'La fecha fin debe de ser mayor a la fecha de inicio', 'error');
  });

});
