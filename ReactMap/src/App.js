import React from 'react';
import { Route } from 'react-router-dom';

import './default.scss';
import MapViewUser from './MapViewUser';


function App() {
    return(
      <div className="App">
        <Route exact path="/" component={MapViewUser}/>
      </div>
      
      
    )

}
export default App;