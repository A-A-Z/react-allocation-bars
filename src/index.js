import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import AllocationBars from './AllocationBars';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<AllocationBars />, document.getElementById('root'));
registerServiceWorker();
