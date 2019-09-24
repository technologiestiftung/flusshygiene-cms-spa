import React from 'react';
import App from '../App';
import { createStore } from 'redux';
import { reducer } from '../../__test-utils/empty-reducer';
import { initialState } from '../../__test-utils/initial-state';
import { render, act } from '../../__test-utils/render-with-providers';
import { createMemoryHistory } from 'history';
import * as Auth0 from '../lib/auth/react-auth0-wrapper';

it.skip('renders App without crashing', () => {
  const history = createMemoryHistory();
  const store = createStore(reducer, initialState);
  // const div = document.createElement('div');
  // act(() => {
  const { container } = render(<App />, store, history);
  // });
  expect(container).toBeTruthy();
  // ReactDOM.render(
  //   <Provider store={store}>
  //     <App />
  //   </Provider>,
  //   div,
  // );
  // ReactDOM.unmountComponentAtNode(div);
});
