import { createStore, applyMiddleware, compose } from "redux"
import createSagaMiddleware from "redux-saga"

import rootReducer from "./reducers"
import rootSaga from "./sagas"

const sagaMiddleware = createSagaMiddleware()
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const localStorageMiddleware = ({getState}) => { // <--- FOCUS HERE
  return (next) => (action) => {
      const result = next(action);
      try{localStorage.setItem('applicationState', JSON.stringify(
        getState()
    ));}
      catch(err){null}
      
      return result;
  };
};

const reHydrateStore = () => { // <-- FOCUS HERE

  if (localStorage.getItem('applicationState') !== null) {
      return JSON.parse(localStorage.getItem('applicationState')) // re-hydrate the store

  }
}

const store = createStore(
  rootReducer,reHydrateStore(),
  composeEnhancers(applyMiddleware(sagaMiddleware,localStorageMiddleware))
)
sagaMiddleware.run(rootSaga)

export default store
