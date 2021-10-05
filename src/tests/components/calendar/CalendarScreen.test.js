// React, redux imports
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { act } from 'react-dom/test-utils';

// Components
import { CalendarScreen } from '../../../components/calendar/CalendarScreen';

// Helpers
import { messages } from '../../../helpers/calendar-messages-es';

// Redux actions
import { uiOpenModal } from '../../../actions/ui';
import { eventSetActive } from '../../../actions/events';

jest.mock('../../../actions/ui', () => ({
  uiOpenModal: jest.fn(),
}));
jest.mock('../../../actions/events', () => ({
  eventSetActive: jest.fn(),
  eventStartLoading: jest.fn(),
}));
Storage.prototype.setItem = jest.fn();

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const initState = {
  auth: {
    uid: '1234',
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
    <CalendarScreen />
  </Provider>
);

describe('Pruebas en <CalendarScreen />', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('debe mostrarse correctamente', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('Pruebas con las interacciones del calendario', () => {
    const calendar = wrapper.find('Calendar');
    const calendarMsgs = calendar.prop('messages');
    
    expect(calendarMsgs).toEqual(messages);

    calendar.prop('onDoubleClickEvent')();
    expect(uiOpenModal).toHaveBeenCalled();

    calendar.prop('onSelectEvent')({ start: 'Hola' });
    expect(eventSetActive).toHaveBeenCalled();

    act(() => {
      calendar.prop('onView')('week');
    });
    expect(localStorage.setItem).toHaveBeenCalledWith('lastView', 'week');
  });

});
