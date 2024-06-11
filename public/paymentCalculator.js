// paymentCalculator.js

import React from 'react';
import ReactDOM from 'react-dom';
import App from './pages/index'; // Assuming your index.js is the calculator

const PaymentCalculator = () => {
  return <App />;
};

export const renderPaymentCalculator = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    ReactDOM.render(<PaymentCalculator />, element);
  } else {
    console.error(`Element with ID ${elementId} not found.`);
  }
};
