import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import firebase from "firebase/app";
import "firebase/database";
import "firebase/analytics";

var firebaseConfig = {
    apiKey: "AIzaSyD5GgEtA6vyLAhYyHyc6epj--yYgf0UZw0",
    authDomain: "planes-c7784.firebaseapp.com",
    databaseURL: "https://planes-c7784-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "planes-c7784",
    storageBucket: "planes-c7784.appspot.com",
    messagingSenderId: "526831128634",
    appId: "1:526831128634:web:ba3d88975c5301e349e503",
    measurementId: "G-2L7VRNYPBY"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();



ReactDOM.render(
  <React.StrictMode>
    <App />

  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
