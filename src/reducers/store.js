import { AsyncStorage } from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import thunk from 'redux-thunk';
import AppReducer from './AppReducer';

const middleWare = [thunk];

const createStoreWithMiddleware = applyMiddleware(...middleWare)(createStore);

export default configureStore = (onComplete) => {
  const store = (createStoreWithMiddleware)(AppReducer);
  persistStore(store, { storage: AsyncStorage }, onComplete);

  return store;
};
