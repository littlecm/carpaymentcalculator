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
    const newApr = aprRates[creditScore];
    console.log(`Updated APR: ${newApr}`);
    setApr(newApr);
  }, [creditScore]);

  useEffect(() => {
    calculatePayment();
  }, [vehiclePrice, downPayment, tradeInValue, financeTerm, apr]);

  function calculatePayment() {
    const principal = vehiclePrice - downPayment - tradeInValue;
    const monthlyRate = apr / 100 / 12;
    const numberOfPayments = financeTerm;

    console.log(`Principal: ${principal}`);
    console.log(`Monthly Rate: ${monthlyRate}`);
    console.log(`Number of Payments: ${numberOfPayments}`);

    const newMonthlyPayment =
      monthlyRate > 0
        ? (principal * monthlyRate) /
          (1 - Math.pow(1 + monthlyRate, -numberOfPayments))
        : principal / numberOfPayments;

    console.log(`New Monthly Payment: ${newMonthlyPayment}`);
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
              max="20000"
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
            <div className="flex space-x-2 mb-2 flex-wrap">
              {[36, 48, 60, 72].map((term) => (
                <button
                  key={term}
                  onClick={() => setFinanceTerm(term)}
                  className={`w-1/4 py-2 border ${
                    financeTerm === term
                      ? "bg-blue-500 text-white"
                      : "border-gray-300"
                  } rounded text-center mb-2`}
                >
                  {term} mo
                </button>
              ))}
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
            <div className="flex space-x-2 mb-2 flex-wrap">
              {["excellent", "good", "fair", "poor"].map((score) => (
                <button
                  key={score}
                  onClick={() => setCreditScore(score)}
                  className={`w-1/4 py-2 border ${
                    creditScore === score
                      ? "bg-blue-500 text-white"
                      : "border-gray-300"
                  } rounded text-center mb-2`}
                >
                  {score.charAt(0).toUpperCase() + score.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="payment-display w-full md:w-1/2 p-6 bg-gray-50 rounded-lg shadow-inner">
          <h3 className="text-xl font-bold mb-4">Finance Summary Estimate</h3>
          <div className="text-left">
            <div className="mb-2 flex justify-between">
              <span className="text-gray-700">Vehicle Budget</span>
              <span className="text-gray-700">{formatCurrency(vehiclePrice)}</span>
            </div>
            <div className="mb-2 flex justify-between">
              <span className="text-gray-700">Down Payment</span>
              <span className="text-gray-700">- {formatCurrency(downPayment)}</span>
            </div>
            <div className="mb-2 flex justify-between">
              <span className="text-gray-700">Trade-In Value</span>
              <span className="text-gray-700">{formatCurrency(tradeInValue)}</span>
            </div>
            <div className="mb-2 flex justify-between border-t pt-2">
              <span className="text-gray-700 font-bold">Total Amount</span>
              <span className="text-gray-700 font-bold">
                {formatCurrency(vehiclePrice - downPayment - tradeInValue)}
              </span>
            </div>
            <div className="mb-2 flex justify-between border-t pt-2">
              <span className="text-gray-700 font-bold">Monthly Payment</span>
              <span className="text-4xl font-bold text-blue-600">
                {formatCurrency(monthlyPayment)}/mo
              </span>
            </div>
            <div className="mb-2 flex justify-between border-t pt-2">
              <span className="text-gray-700 font-bold">APR</span>
              <span className="text-gray-700 font-bold">{apr}%</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4" style={{ fontSize: "10px" }}>
            *Tax, title, and tags vary by state. All costs and incentives, including taxes and fees, will be finalized at the time of purchase. All financing on approved credit. The Estimated Monthly Payment is only an estimate and should not be relied upon; this estimated amount may be different than other estimates or terms found throughout the site.
          </p>
        </div>
      </div>
    </div>
  );
}
