import { useEffect, useState, useContext } from 'react';
import OBP from './OBP';
import Loader from './Loader';
import { ThemeContext } from '../utils/ThemeContext';

function OrderBookWrapper({ bestAsk, bestBid, ob, handleAgg, pair }) {
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
        <div>
          <OBP key={ob.asks} type="ask" orders={asks} pair={pair} />
        </div>

        <div
          className={`OB__S ${
            isDarkMode ? 'bg-yellow-200 text-gray-500' : 'text-gray-100'
          }`}
        >
          <div className="OB__SL">USD Spread: </div>
          <div className="OB__SP">{spread}</div>
        </div>

        <div>
          <OBP key={ob.bids} type="bid" orders={bids} pair={pair} />
        </div>

        <div
          className={`OB__header ${
            isDarkMode ? 'text-gray-100 bg-gray-500' : 'text-gray-100'
          }`}
        >
          <div
            className={`OB__header1 font-bold ${
              isDarkMode ? ' text-gray-100 bg-gray-500' : 'text-gray-100'
            }`}
          >
            Advanced Settings
            <div
              className={`OB__header1 flex inline-flex w-max font-thin ${
                isDarkMode ? 'text-gray-100 bg-gray-500' : 'text-gray-100'
              }`}
            >
              <label className="pl-3 py-1 " htmlFor="cur-select">
                Aggregate:
              </label>
              <select
                id="cur-select"
                className={`my-1 mr-3 cursor-pointer bg-gray-800 text-md rounded focus:outline-none ${
                  isDarkMode ? 'text-gray-100 bg-gray-500' : 'text-gray-100'
                }`}
                name="currency"
                onChange={(e) => {
                  handleAgg(e);
                }}
              >
                <option defaultValue={true}>In USD</option>
                {[0.05, 0.1, 0.5, 1.0].map((agg, idx) => {
                  return (
                    <option key={agg} value={agg}>
                      {agg}
                    </option>
                  );
                })}
              </select>
              <label className="pr-3 py-1 " htmlFor="cur-select">
                Dark Mode:
              </label>
              <div
                role="checkbox"
                aria-checked={isDarkMode ? 'true' : 'false'}
                tabIndex={0}
                onClick={toggleTheme}
                className={`self-center cursor-pointer w-11 line h-5 rounded-full relative px-1.5 flex items-center${
                  isDarkMode ? '' : ' justify-end'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full absolute transform duration-200 ease-out bg-white left-0.5 ${
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
            className={`OB__header1 ${
              isDarkMode ? 'text-gray-100 bg-gray-500' : 'text-gray-100'
            }`}
          >
            Orderbook
          </div>

          <div
            className={`OB__header2 ${
              isDarkMode ? 'text-gray-100 bg-gray-500' : 'text-gray-100'
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
