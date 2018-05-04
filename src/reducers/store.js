import { AsyncStorage } from 'react-native';
import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, REHYDRATE, PURGE, persistCombineReducers } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk';
import AppReducer from './AppReducer';

const middleware = [thunk];
const config = {key: 'primary',storage};

let reducer = persistCombineReducers(config, AppReducer)
export default configureStore = (onComplete) => {
  const store = createStore(reducer,undefined,compose(applyMiddleware(...middleware)));
  persistStore(store, null, (err,restoredState)=>{ store.getState()});

  return store;
};
