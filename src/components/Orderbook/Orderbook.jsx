import { useEffect, useState, useContext } from 'react';
import OBP from './OBP';
import Loader from '../Loader';
import { ThemeContext } from '../../contexts/ThemeContext';
import { Tooltip } from '../../utils/Tooltip/Tooltip';
import './Orderbook.styles.css';
import { USDollar } from '../../utils/utils';

function OrderBookWrapper({
  bestAsk,
  bestBid,
  ob,
  handleAgg,
  pair,
  aggregate,
}) {
  const [spread, setSpread] = useState(0);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  let { bids, asks } = ob;
  useEffect(() => {
    if (asks[1] && bids[1]) {
      setSpread((Number(bestAsk) - Number(bestBid)).toFixed(2));
    }
  }, [ob, asks, bids, spread, bestAsk, bestBid]);

  // console.log(asks, bids);

  return (
    <div className="OB flex relative h-screen flex-col rounded">
      (
      <>
        <div className="border-double border-4 border-red-500">
          <OBP key={ob.asks} type="ask" orders={asks} pair={pair} />
        </div>

        <div
          className={`OB__S ${
            isDarkMode
              ? ' text-gray-500 hover:text-gray-800'
              : 'text-gray-100 hover:text-gray-300'
          }`}
        >
          <div className="OB__SL">
            <Tooltip text="USD Spread">Spread: </Tooltip>
          </div>

          <div className="OB__SP">{USDollar.format(spread)}</div>
        </div>

        <div className="border-double border-4 border-green-500">
          <OBP key={ob.bids} type="bid" orders={bids} pair={pair} />
        </div>

        <div
          className={`OB__header ${
            isDarkMode ? 'text-gray-100 bg-gray-500' : 'text-gray-100'
          }`}
        >
          <div
            className={`OB__header1 pt-1 mb-1 font-bold flex flex-col text-xs md:text-lg  ${
              isDarkMode
                ? ' text-gray-800 bg-gray-300 hover:text-gray-700'
                : 'text-gray-100 hover:text-gray-300'
            }`}
          >
            Additional Settings
          </div>
          <div className="flex flex-row justify-center">
            <div
              className={`OB__header1 flex flex-row justify-center md:space-x-3 font-bold text-xs lg:text-md px-3 ${
                isDarkMode
                  ? 'text-gray-800 bg-gray-300 hover:text-gray-700'
                  : 'text-gray-100 hover:text-gray-300'
              }`}
            >
              <Tooltip text="Aggregate in USD">
                <label
                  className="my-3 pl-1 ml-1 align-baseline hidden md:block"
                  htmlFor="cur-select"
                >
                  Aggregate:
                </label>
              </Tooltip>
              <select
                id="cur-select"
                className={`my-1 mr-3 cursor-pointer md:ml-2 text-md rounded focus:outline-none ${
                  isDarkMode
                    ? 'text-gray-800 bg-gray-300 hover:text-gray-700'
                    : 'text-gray-200 bg-gray-800 hover:text-gray-100'
                }`}
                name="aggregate"
                onChange={(e) => {
                  handleAgg(e);
                }}
              >
                <option defaultValue={true}>{aggregate}</option>
                {[0.05, 0.1, 0.5, 1.0].map((agg, idx) => {
                  return (
                    <option key={agg} value={agg}>
                      {agg}
                    </option>
                  );
                })}
              </select>
              <label
                className="mt-3 align-baseline hidden md:block"
                htmlFor="cur-select"
              >
                Dark Mode:
              </label>
              <div
                role="checkbox"
                aria-checked={isDarkMode ? 'true' : 'false'}
                tabIndex={0}
                onClick={toggleTheme}
                className={`mr-1 pr-1 self-center cursor-pointer w-11 line h-5 rounded-full relative flex items-center${
                  isDarkMode ? '' : ' justify-end'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full absolute transform duration-200 ease-out bg-sky-300 left-0.5 ${
                    isDarkMode ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
                {isDarkMode ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>

          <div
            className={`OB__header1 text-xs hidden md:text-lg md:inline px-3 ${
              isDarkMode ? 'text-gray-800 bg-gray-300' : 'text-gray-100'
            }`}
          >
            Live Coinbase Orderbook
          </div>

          <div
            className={`OB__header2 ${
              isDarkMode ? 'text-gray-800 bg-gray-300' : 'text-gray-100'
            }`}
          >
            <div>Size</div>
            <div>Price</div>
          </div>
        </div>
      </>
      ) : (
      <Loader />)
    </div>
  );
}

export default OrderBookWrapper;
