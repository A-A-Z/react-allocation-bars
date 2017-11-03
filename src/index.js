import React from 'react';
import ReactDOM from 'react-dom';
import AllocationBars from './AllocationBars';
import registerServiceWorker from './registerServiceWorker';

const data = {"data":[{"id":164119,"job":{"id":13035,"label":"Goodyear.com.au Customer Care 201703 to 201802"},"deliveryManager":"Bobby Chauksay","myRole":"Tech Lead FE AU","weekStart":null,"weekOne":1.0,"weekTwo":1.0,"weekThree":1.0,"weekFour":1.0,"effortHour":0.0},{"id":297503,"job":{"id":15990,"label":"Bayer IWM new website section - build"},"deliveryManager":"Bhavin Sudra","myRole":"Tech Lead FE AU","weekStart":null,"weekOne":8.0,"weekTwo":10.0,"weekThree":10.0,"weekFour":0.0,"effortHour":0.0},{"id":298592,"job":{"id":13649,"label":"Beaurepaires UX enhancements June 2017"},"deliveryManager":"Bobby Chauksay","myRole":"Tech Lead FE AU","weekStart":null,"weekOne":4.0,"weekTwo":0.0,"weekThree":0.0,"weekFour":0.0,"effortHour":0.0},{"id":298593,"job":{"id":16174,"label":"BEAU Customer Care - 6 months  1 Oct to 31 March 18"},"deliveryManager":"Bobby Chauksay","myRole":"Tech Lead FE AU","weekStart":null,"weekOne":4.0,"weekTwo":0.0,"weekThree":0.0,"weekFour":0.0,"effortHour":0.0}]}

ReactDOM.render(
  <AllocationBars allocationData={data} jobLinkFormat='/Home/Job#/details/resources/{id}' />, document.getElementById('root'));

registerServiceWorker();
