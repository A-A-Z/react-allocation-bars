import React from 'react';
import ReactDOM from 'react-dom';
import AllocationBars from './AllocationBars';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <AllocationBars
    hoursPerWeek={40}
  />, document.getElementById('root'));
registerServiceWorker();
