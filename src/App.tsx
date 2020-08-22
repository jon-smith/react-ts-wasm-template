import React from 'react';

import { Provider } from 'react-redux';

import configureStore from 'store/configure-store';
import AppImpl from './components/app-impl';

const store = configureStore();

const App = () => (
	<Provider store={store}>
		<AppImpl />
	</Provider>
);

export default App;
