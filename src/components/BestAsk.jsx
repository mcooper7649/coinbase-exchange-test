import { USDollar } from '../utils/utils';
import { ThemeContext } from '../contexts/ThemeContext';
import { useContext } from 'react';
import Loader from './Loader';

function BestAsk({ bestAsk, bestAskSize }) {
  const { isDarkMode } = useContext(ThemeContext);
  if ((bestAsk, bestAskSize)) {
    return (
      <div className="grid overflow-hidden grid-cols-2 grid-rows-2 gap-1.5 w-auto h-auto">
        <div className="row-start-1 row-span-1 col-start-1 col-end-3 text-xs md:text-lg">
          <h1
            className={`border-b-4  ${
              isDarkMode ? 'border-gray-800' : 'text-red-300 border-gray-300'
            }`}
          >
            Best Ask: CoinBase Pro
          </h1>
        </div>

        {/* {AskAmount} */}

        <p className="font-bold text-xs md:text-lg">Ask Price</p>
        <p key={bestAsk} className="roll-out">
          {USDollar.format(bestAsk)}
        </p>

        {/* <h2>{AskQuantity}</h2> */}
        <p className="text-xs md:text-lg font-bold ">Ask Quantity</p>
        <p key={bestAskSize} className=" roll-out">
          {bestAskSize}
        </p>
      </div>
    );
  } else {
    return <Loader />;
  }
}

export default BestAsk;
