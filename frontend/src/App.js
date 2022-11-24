/* eslint eqeqeq: 0 */

import React, { Component } from 'react'
//import route from 'routes/routes'
import MainPage from './components/MainPage/MainPage'
import './App.css'
import 'moment/locale/es';
import 'moment/locale/fr';
import moment from 'moment';
import { getLanguageLocal } from "./Language/language.service";
import api from './reduxRelated/middleware/api'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
/* import { BrowserRouter as Router} from 'react-router-dom'; */
import rootReducer from './reduxRelated/reducer/index.js'
import 'react-table/react-table.css'
import 'react-day-picker/lib/style.css'
import 'react-toastify/dist/ReactToastify.css'
let createStoreWithMiddleware = applyMiddleware(thunkMiddleware, api)(createStore)
let store = createStoreWithMiddleware(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());


moment.locale(getLanguageLocal());

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <MainPage />
      </Provider>
    )
  }
}

export default App
