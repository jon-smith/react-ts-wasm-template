import { enableBatching } from 'redux-batched-actions';
import { configureStore as toolkitConfigure, getDefaultMiddleware } from '@reduxjs/toolkit';
import { rootReducer } from './reducers';

const makeReducer = () => enableBatching(rootReducer);

const configureStore = () => {
	const store = toolkitConfigure({
		reducer: makeReducer(),
		middleware: getDefaultMiddleware({
			serializableCheck: false,
			immutableCheck: false,
		}),
		devTools: true,
	});

	if (process.env.NODE_ENV !== 'production') {
		if (module.hot) {
			module.hot.accept('./reducers', () => {
				store.replaceReducer(makeReducer());
			});
		}
	}

	return store;
};

export default configureStore;
