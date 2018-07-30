import {createStore, applyMiddleware} from 'redux';
import reducer from '../reducers'
import {createLogger} from "redux-logger";
import rootSaga from '../sagas'
const loggerMiddleware = createLogger();

import createSagaMiddleware from 'redux-saga'


const sagaMiddleWare = createSagaMiddleware()

const middleware = () => {
  return applyMiddleware(sagaMiddleWare, loggerMiddleware)
}

export let initialState = {
  wallet: {
      wif: null,
      address: null,
      passphrase: null,
      encryptedWIF: null,
      generating: false,
      decrypting: false,
      loggedIn: false,
      created: false,
      logInError: null,
      neo: 0,
      gas: 0,
      price: 0.0,
      transactions: [],
      claimAmount: 0,
      claimUnspend: 0,
      updateSendIndicators: false,
      pendingBlockConfirm: false
  },
  network: {
      net: 'TestNet',
      blockHeight: {
          TestNet: 0,
          MainNet: 0
      }
  },
  claim: {
      unspendToClear: false,
      sentToSelfSuccess: false,
      transactionCleared: false,
      gasClaimed: false
  },
  settings: {
      saved_keys: {} // key: name
  },
  auth:{
      user:{}
  }
}

export const store = createStore(reducer, initialState, middleware())

//  const store=createStore(reducer,initialState,compose(middleware(),autoRehydrate()))

//  persistStore(store, { storage: AsyncStorage })

sagaMiddleWare.run(rootSaga)

export default store


