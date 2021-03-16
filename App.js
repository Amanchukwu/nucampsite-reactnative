import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Main from './components/MainComponent';
import { Provider } from 'react-redux'; //Imported to connect the redux store to react
import { ConfigureStore } from './redux/configureStore';//Function we created which creates configures and returns the redux store
import { PersistGate } from 'redux-persist/es/integration/react';
import Loading from './components/LoadingComponent';

const { persistor, store } = ConfigureStore(); //Bring in the "persistor" and the "store" objects from "ConfigureStore()" using object destructuring syntax. When called just "const store =" the note was: Create the redux store by calling "ConfigureStore" into this variable "store". 

export default function App() {
  return ( //Wrap the <Main> component with the <Provider> component and pass the <Provider> component the store calling it "store". Gives the <Main> component and all its children the ability to connect to the redux store. 
    <Provider store={store}>
      <PersistGate //wrap the <Main> component in <PersistGate>, it prevents the application from rendering until the redux store has "rehydrated" fully from the client side storage
        loading={<Loading />} //"loading" is a built in property, whatever component is passed into it is what will show while the redux store is rehydrating
        persistor={persistor} /*must be passed the "persistor" object as well*/>
        <Main />
      </PersistGate>
    </Provider>
  );
}