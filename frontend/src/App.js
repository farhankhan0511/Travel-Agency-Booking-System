
import { Provider } from 'react-redux';
import './App.css';

import appstore from './utils/appstore';
import Body from './components/Body.js';

function App() {
  return <Provider store={appstore}>
    
  <Body/>
</Provider>;
}

export default App;
