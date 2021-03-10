import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Main from './components/MainComponent';
import { Provider } from 'react-redux'; //Imported to connect the redux store to react
import { ConfigureStore } from './redux/configureStore';//Function we created which creates configures and returns the redux store

const store = ConfigureStore(); //Create the redux store by calling "ConfigureStore" into this variable "store"

export default function App() {
  return ( //Wrap the <Main> component with the <Provider> component and pass the <Provider> component the store calling it "store". Gives the <Main> component and all its children the ability to connect to the redux store. 
    <Provider store={store}>
      <Main />
    </Provider>
  );
}