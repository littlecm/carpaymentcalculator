import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const aprRates = {
  excellent: 6.0,
  good: 8.0,
  fair: 12.0,
  poor: 16.0,
};

export default function Home() {
  const router = useRouter();
  const { query } = router;

  const [vehiclePrice, setVehiclePrice] = useState(
    query.price ? parseFloat(query.price) : 20000
  );
  const [downPayment, setDownPayment] = useState(1000);
  const [tradeInValue, setTradeInValue] = useState(0);
  const [financeTerm, setFinanceTerm] = useState(60);
  const [creditScore, setCreditScore] = useState("excellent");
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [apr, setApr] = useState(aprRates[creditScore]);

  useEffect(() => {
    setApr(aprRates[creditScore]);
    calculatePayment();
  }, [vehiclePrice, downPayment, tradeInValue, financeTerm, creditScore]);

  function calculatePayment() {
    const principal = vehiclePrice - downPayment - tradeInValue;
    const monthlyRate = apr / 100 / 12;
    const numberOfPayments = financeTerm;

    const newMonthlyPayment =
      monthlyRate > 0
        ? (principal * monthlyRate) /
          (1 - Math.pow(1 + monthlyRate, -numberOfPayments))
        : principal / numberOfPayments;

    setMonthlyPayment(Math.round(newMonthlyPayment));
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="calculator-container bg-white p-8 rounded-lg shadow-md flex flex-col md:flex-row">
        <div className="calculator-form w-full md:w-1/2 mb-6 md:mb-0">
          <h2 className="text-2xl font-bold mb-4">Car Payment Calculator</h2>
          <div className="form-group mb-4">
            <label
              htmlFor="vehiclePrice"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Vehicle Price
            </label>
            <input
              type="range"
              id="vehiclePriceRange"
              min="0"
              max="80000"
              step="1000"
              value={vehiclePrice}
              onChange={(e) => setVehiclePrice(parseFloat(e.target.value))}
              className="w-full"
            />
            <input
              type="text"
              id="vehiclePrice"
              value={formatCurrency(vehiclePrice)}
              onChange={(e) =>
                setVehiclePrice(
                  parseFloat(e.target.value.replace(/[$,]/g, ""))
                )
              }
              className="w-full p-2 border border-gray-300 rounded mt-2"
            />
          </div>
          <div className="form-group mb-4">
            <label
              htmlFor="downPayment"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Down Payment
            </label>
            <input
              type="range"
              id="downPaymentRange"
              min="0"
              max="80000"
              step="100"
              value={downPayment}
              onChange={(e) => setDownPayment(parseFloat(e.target.value))}
              className="w-full"
            />
            <input
              type="text"
              id="downPayment"
              value={formatCurrency(downPayment)}
              onChange={(e) =>
                setDownPayment(
                  parseFloat(e.target.value.replace(/[$,]/g, ""))
                )
              }
              className="w-full p-2 border border-gray-300 rounded mt-2"
            />
          </div>
          <div className="form-group mb-4">
            <label
              htmlFor="tradeInValue"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Trade-In Value
            </label>
            <input
              type="text"
              id="tradeInValue"
              value={formatCurrency(tradeInValue)}
              onChange={(e) =>
                setTradeInValue(
                  parseFloat(e.target.value.replace(/[$,]/g, ""))
                )
              }
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="form-group mb-4">
            <label
              htmlFor="financeTerm"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Finance Term (months)
            </label>
            <div className="flex space-x-2 mb-2">
              <button
                onClick={() => setFinanceTerm(36)}
                className="w-1/4 py-2 border border-gray-300 rounded"
              >
                36 mo
              </button>
              <button
                onClick={() => setFinanceTerm(48)}
                className="w-1/4 py-2 border border-gray-300 rounded"
              >
                48 mo
              </button>
              <button
                onClick={() => setFinanceTerm(60)}
                className="w-1/4 py-2 border border-gray-300 rounded"
              >
                60 mo
              </button>
              <button
                onClick={() => setFinanceTerm(72)}
                className="w-1/4 py-2 border border-gray-300 rounded"
              >
                72 mo
              </button>
            </div>
            <input
              type="number"
              id="financeTerm"
              value={financeTerm}
              onChange={(e) => setFinanceTerm(parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="form-group mb-4">
            <label
              htmlFor="creditScore"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Credit Score
            </label>
            <select
              id="creditScore"
              value={creditScore}
              onChange={(e) => setCreditScore(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="excellent">Excellent (720-850)</option>
              <option value="good">Good (690-719)</option>
              <option value="fair">Fair (630-689)</option>
              <option value="poor">Poor (300-629)</option>
            </select>
          </div>
        </div>
        <div className="payment-display w-full md:w-1/2 p-6 bg-gray-50 rounded-lg shadow-inner">
          <h3 className="text-xl font-bold mb-4">Finance Summary Estimate</h3>
          <div className="text-left">
            <div className="breakdown-item">
              <span className="text-gray-700">Vehicle Budget</span>
              <span className="text-gray-700">{formatCurrency(vehiclePrice)}</span>
            </div>
            <div className="breakdown-item">
              <span className="text-gray-700">Down Payment</span>
              <span className="text-gray-700">- {formatCurrency(downPayment)}</span>
            </div>
            <div className="breakdown-item">
              <span className="text-gray-700">Trade-In Value</span>
              <span className="text-gray-700">{formatCurrency(tradeInValue)}</span>
            </div>
            <div className="breakdown-item total border-t pt-2">
              <span className="text-gray-700 font-bold">Total Amount</span>
              <span className="text-gray-700 font-bold">
                {formatCurrency(vehiclePrice - downPayment - tradeInValue)}
              </span>
            </div>
            <div className="breakdown-item total border-t pt-2">
              <span className="text-gray-700 font-bold">Monthly Payment</span>
              <span className="text-4xl font-bold text-blue-600">
                {formatCurrency(monthlyPayment)}/mo
              </span>
            </div>
            <div className="breakdown-item total border-t pt-2">
              <span className="text-gray-700 font-bold">APR</span>
              <span className="text-gray-700 font-bold">{apr}%</span>
            </div>
          </div>
          <p className="disclaimer text-xs text-gray-400 mt-4" style={{ fontSize: "10px" }}>
            *Title and other fees and incentives are not included in this calculation, which is an estimate only. Monthly payment estimates are for informational purposes and do not represent a financing offer from the seller of this vehicle. Other taxes may apply.
          </p>
        </div>
      </div>
    </div>
  );
}
