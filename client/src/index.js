import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import Stores from './store';
import { create } from 'mobx-persist';
import {BrowserRouter} from 'react-router-dom';
import localForage from 'localforage';

import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';

import 'bootstrap/dist/css/bootstrap.min.css';

const hydrate = create({
    storage: localForage,   // or AsyncStorage in react-native.
                            // default: localStorage
    jsonify: false  // if you use AsyncStorage, here shoud be true
                    // default: true
});

hydrate('auth', Stores.Auth)
    .then(() => {
	  const app = (
			<Provider stores={Stores}>
				<BrowserRouter basename="/admin">
					<App />
				</BrowserRouter>
			</Provider>
		);

      ReactDOM.render(app, document.getElementById('root'));
	});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();