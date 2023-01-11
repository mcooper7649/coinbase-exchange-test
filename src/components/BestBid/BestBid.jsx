import { USDollar } from '../../utils/utils';
import { ThemeContext } from '../../contexts/ThemeContext';
import { useContext } from 'react';
import Loader from '../Loader';

function BestBid({ bestBid, bestBidSize }) {
  const { isDarkMode } = useContext(ThemeContext);
  if ((bestBid, bestBidSize)) {
    return (
      <div className="grid overflow-hidden grid-cols-2 grid-rows-2 gap-1.5 w-auto h-auto">
        <div className="row-start-1 row-span-1 col-start-1 col-end-3 text-xs md:text-lg">
          <h1
            className={`border-b-4  ${
              isDarkMode ? 'border-gray-800' : 'text-green-300 border-gray-300'
            }`}
          >
            Best Bid: CoinBase Pro
          </h1>
        </div>
        <p className="text-xs  md:text-lg font-bold">Bid Price</p>
        <p key={bestBid} className="roll-out">
          {USDollar.format(bestBid)}
        </p>
        <p className="text-xs  md:text-lg font-bold">Bid Quantity</p>
        <p key={bestBidSize} className="roll-out">
          {' '}
          {bestBidSize}
        </p>
      </div>
    );
  } else {
    return (
      <div className="pt-5 mt-5">
        <Loader />
      </div>
    );
  }
}

export default BestBid;
