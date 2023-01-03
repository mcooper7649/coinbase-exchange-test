import { USDollar } from '../utils/utils';
import { ThemeContext } from '../utils/ThemeContext';
import { useContext } from 'react';

function BestAsk({ bestAsk, bestAskSize }) {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  return (
    <div className="grid overflow-hidden grid-cols-2 grid-rows-2 gap-1.5 w-auto h-auto">
      <div className="row-start-1 row-span-1 col-start-1 col-end-3 text-xs md:text-lg">
        <h1
          className={`border-b-4 border-gray-300 ${
            isDarkMode ? '' : 'text-red-300'
          }`}
        >
          Best Ask: CoinBase Pro
        </h1>
      </div>

      {/* {AskAmount} */}

      <p className="text-xs md:text-lg animate-pulse">Ask Price</p>
      {USDollar.format(bestAsk)}

      {/* <h2>{AskQuantity}</h2> */}
      <p className="text-xs md:text-lg animate-pulse">Ask Quantity</p>
      {bestAskSize}
    </div>
  );
}

export default BestAsk;
