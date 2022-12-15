import { USDollar } from '../utils/utils';
function BestBid({ bestBid, bestBidSize }) {
  return (
    <div className="grid overflow-hidden grid-cols-2 grid-rows-2 gap-1.5 w-auto h-auto">
      <div className="row-start-1 row-span-1 col-start-1 col-end-3 text-xs md:text-lg">
        <h1 className="text-green-300 border-b-4 border-gray-300">
          Best Bid: CoinBase Pro
        </h1>
      </div>

      {/* {BidAmount} */}
      {USDollar.format(bestBid)}
      <p className="text-xs md:text-lg">Bid Price</p>

      {/* <h2>{BidQuantity}</h2> */}
      {bestBidSize}
      <p className="text-xs md:text-lg">Bid Quantity</p>
    </div>
  );
}

export default BestBid;
