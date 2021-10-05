// React, redux imports
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

// Redux actions
import { eventStartDelete } from '../../../actions/events';

// Components
import { DeleteEventFab } from '../../../components/ui/DeleteEventFab';

jest.mock('../../../actions/events', () => ({
  eventStartDelete: jest.fn(),
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const initState = {};
let store = mockStore(initState);
store.dispatch = jest.fn();

const wrapper = mount(
  <Provider store={ store }>
    <DeleteEventFab />
  </Provider>
);

describe('Pruebas en <DeleteEventFab />', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe de mostrarse correctamente', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('debe de llamar el eventStartDelete al hacer clic', () => {
    wrapper.find('button').prop('onClick')();

    expect(eventStartDelete).toHaveBeenCalled();
  });

});
