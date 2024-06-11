// src/paymentCalculatorEntry.js

import React from 'react';
import ReactDOM from 'react-dom';
import PaymentCalculator from './PaymentCalculatorComponent';

window.renderPaymentCalculator = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    ReactDOM.render(<PaymentCalculator />, element);
  } else {
    console.error(`Element with ID ${elementId} not found.`);
  }
};
