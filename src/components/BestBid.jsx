import { USDollar } from '../utils/utils';
import { ThemeContext } from '../utils/ThemeContext';
import { useContext } from 'react';

function BestBid({ bestBid, bestBidSize }) {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <div className="grid overflow-hidden grid-cols-2 grid-rows-2 gap-1.5 w-auto h-auto">
      <div className="row-start-1 row-span-1 col-start-1 col-end-3 text-xs md:text-lg">
        <h1
          className={`border-b-4 border-gray-300 ${
            isDarkMode ? '' : 'text-green-300'
          }`}
        >
          Best Bid: CoinBase Pro
        </h1>
      </div>

      {/* {BidAmount} */}
      <p className="text-xs md:text-lg animate-pulse">Bid Price</p>
      <p className="">{USDollar.format(bestBid)}</p>

      {/* <h2>{BidQuantity}</h2> */}
      <p className="text-xs md:text-lg animate-pulse">Bid Quantity</p>
      {bestBidSize}
    </div>
  );
}

export default BestBid;
