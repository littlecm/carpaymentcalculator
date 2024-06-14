import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const aprRates = {
  excellent: 6.0,
  good: 8.0,
  fair: 12.0,
  poor: 16.0,
};

const downPayments = [0, 1000, 2000, 3000, 5000];
const financeTerms = [36, 48, 60, 72, 84];

export default function Home() {
  const router = useRouter();
  const { query } = router;

  const initialPrice = query.price ? parseFloat(query.price) : 20000;

  const [vehiclePrice, setVehiclePrice] = useState(initialPrice);
  const [downPayment, setDownPayment] = useState(1000);
  const [tradeInValue, setTradeInValue] = useState(0);
  const [financeTerm, setFinanceTerm] = useState(60);
  const [creditScore, setCreditScore] = useState("excellent");
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [apr, setApr] = useState(aprRates[creditScore]);

  useEffect(() => {
    const newApr = aprRates[creditScore];
    setApr(newApr);
    calculateCurrentPayment(newApr);
  }, [creditScore]);

  useEffect(() => {
    calculateCurrentPayment(apr);
  }, [vehiclePrice, downPayment, tradeInValue, financeTerm, apr]);

  function calculatePayment(principal, monthlyRate, numberOfPayments) {
    return monthlyRate > 0
      ? (principal * monthlyRate) /
          (1 - Math.pow(1 + monthlyRate, -numberOfPayments))
      : principal / numberOfPayments;
  }

  function calculateCurrentPayment(currentApr) {
    const principal = vehiclePrice - downPayment - tradeInValue;
    const monthlyRate = currentApr / 100 / 12;
    const numberOfPayments = financeTerm;

    const newMonthlyPayment = calculatePayment(
      principal,
      monthlyRate,
      numberOfPayments
    );
    setMonthlyPayment(Math.round(newMonthlyPayment));
  }

  function getPotentialPayments(currentApr) {
    const principal = vehiclePrice - tradeInValue;
    const monthlyRate = currentApr / 100 / 12;
    return downPayments.map((dp) => {
      const newPayment = calculatePayment(
        principal - dp,
        monthlyRate,
        financeTerm
      );
      const paymentDifference = Math.round(newPayment) - monthlyPayment;
      return { downPayment: dp, paymentDifference };
    });
  }

  function getPotentialTermPayments(currentApr) {
    const principal = vehiclePrice - downPayment - tradeInValue;
    const monthlyRate = currentApr / 100 / 12;
    return financeTerms.map((term) => {
      const newPayment = calculatePayment(principal, monthlyRate, term);
      const paymentDifference = Math.round(newPayment) - monthlyPayment;
      return { term, paymentDifference };
    });
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  const potentialPayments = getPotentialPayments(apr);
  const potentialTermPayments = getPotentialTermPayments(apr);

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="calculator-container bg-white p-8 rounded-lg shadow-md flex flex-col md:flex-row">
        <div className="calculator-form w-full md:w-1/2 mb-6 md:mb-0">
          <h2 className="text-2xl font-bold mb-4 text-center">Car Payment Calculator</h2>
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
            <div className="flex flex-wrap gap-2 md:gap-4 mb-2">
              {potentialPayments.map(({ downPayment: dp, paymentDifference }) => (
                <button
                  key={dp}
                  onClick={() => setDownPayment(dp)}
                  className={`w-full md:w-1/4 py-2 border ${
                    downPayment === dp ? "bg-blue-500 text-white" : "border-gray-300"
                  } rounded text-center flex flex-col items-center`}
                >
                  {formatCurrency(dp)}
                  {downPayment !== dp && (
                    <span className={`text-xs ${paymentDifference > 0 ? "text-red-600" : "text-green-600"}`}>
                      {paymentDifference > 0 ? "↑" : "↓"} {formatCurrency(Math.abs(paymentDifference))}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <input
              type="text"
              id="downPayment"
              value={formatCurrency(downPayment)}
              onChange={(e) => setDownPayment(parseFloat(e.target.value.replace(/[$,]/g, "")))}
              className="w-full p-2 border border-gray-300 rounded"
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
            <div className="flex flex-wrap gap-2 md:gap-4 mb-2">
              {potentialTermPayments.map(({ term, paymentDifference }) => (
                <button
                  key={term}
                  onClick={() => setFinanceTerm(term)}
                  className={`w-full md:w-1/4 py-2 border ${
                    financeTerm === term ? "bg-blue-500 text-white" : "border-gray-300"
                  } rounded text-center flex flex-col items-center`}
                >
                  {term} mo
                  {financeTerm !== term && (
                    <span className={`text-xs ${paymentDifference > 0 ? "text-red-600" : "text-green-600"}`}>
                      {paymentDifference > 0 ? "↑" : "↓"} {formatCurrency(Math.abs(paymentDifference))}
                    </span>
                  )}
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
            <div className="flex flex-wrap gap-2 md:gap-4 mb-2">
              {["excellent", "good", "fair", "poor"].map((score) => (
                <button
                  key={score}
                  onClick={() => setCreditScore(score)}
                  className={`w-full md:w-1/4 py-2 border ${
                    creditScore === score ? "bg-blue-500 text-white" : "border-gray-300"
                  } rounded text-center text-sm md:text-base`}
                >
                  {score.charAt(0).toUpperCase() + score.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="payment-display max-w-sm mx-auto rounded-lg shadow-lg p-6 bg-white md:w-1/2 md:bg-gray-50 md:shadow-inner">
          <h3 className="text-xl font-bold mb-4 text-center md:text-left">Finance Summary Estimate</h3>
          <div className="space-y-2 md:space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-700">Vehicle Budget</span>
              <span className="text-gray-700">{formatCurrency(vehiclePrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Down Payment</span>
              <span className="text-gray-700">- {formatCurrency(downPayment)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Trade-In Value</span>
              <span className="text-gray-700">{formatCurrency(tradeInValue)}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between">
              <span className="font-bold">Total Amount</span>
              <span className="font-bold">{formatCurrency(vehiclePrice - downPayment - tradeInValue)}</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="font-bold text-center md:text-left">
              <span className="block">Monthly</span>
              <span className="text-4xl">{formatCurrency(monthlyPayment)}</span>
              <span className="text-sm font-medium">/mo</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between">
              <span>APR</span>
              <span>{apr}%</span>
            </div>
          </div>
          <div className="text-xs text-gray-600 mt-4 text-center md:text-left">
            <p className="text-[7px]">
              *Tax, title, and tags vary by state. All costs and incentives, including taxes and fees, will be finalized at the time of purchase.
            </p>
            <p className="text-[7px]">The Estimated Monthly Payment is an estimate and is subject to change.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
